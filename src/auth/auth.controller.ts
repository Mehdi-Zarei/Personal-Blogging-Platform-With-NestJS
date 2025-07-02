import { Controller, Get, Post, Body, Param, HttpCode, UseGuards, Req, Res, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { OtpDto, RegisterDto, VerifyOtpDto } from "./dto/auth.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Request } from "express";

@ApiTags("Auth")
@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConsumes(SwaggerConsumes.FORM, SwaggerConsumes.JSON)
  @HttpCode(200)
  @Post("/send")
  send(@Body() otpDto: OtpDto) {
    return this.authService.send(otpDto);
  }

  @ApiConsumes(SwaggerConsumes.FORM, SwaggerConsumes.JSON)
  @HttpCode(200)
  @Post("/verify")
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verify(verifyOtpDto);
  }

  @ApiConsumes(SwaggerConsumes.FORM, SwaggerConsumes.JSON)
  @Post("/register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(AuthGuard)
  @Get("/me")
  getMe(@Req() req: Request) {
    const user = req.user as { name: string; email?: string; phone: string; profileImage?: string; bio?: string; gender?: string };

    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      bio: user.bio,
      gender: user.gender,
    };
  }

  @Get("/refresh-token")
  refreshToken(@Req() req: Request) {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید.");
    }

    return this.authService.refreshToken(token);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(AuthGuard)
  @Post("/logout")
  logout(@Req() req: Request) {
    const userId = req.user?.id;

    return this.authService.logout(userId!);
  }
}
