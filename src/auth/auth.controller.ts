import { Controller, Get, Post, Body, HttpCode, UseGuards, Req, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { OtpDto, RegisterDto, VerifyOtpDto } from "./dto/auth.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { CustomAuthGuard } from "src/common/guards/auth.guard";

@ApiTags("Auth")
@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "send OTP" })
  @ApiConsumes(SwaggerConsumes.FORM, SwaggerConsumes.JSON)
  @HttpCode(200)
  @Post("/send")
  send(@Body() otpDto: OtpDto) {
    return this.authService.send(otpDto);
  }

  @ApiOperation({ summary: "Verify OTP" })
  @ApiConsumes(SwaggerConsumes.FORM, SwaggerConsumes.JSON)
  @HttpCode(200)
  @Post("/verify")
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verify(verifyOtpDto);
  }

  @ApiOperation({ summary: "Register Users" })
  @ApiConsumes(SwaggerConsumes.FORM, SwaggerConsumes.JSON)
  @Post("/register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: "Get User Profile" })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Get("/me")
  getMe(@Req() req: Request) {
    const user = req.user as {
      name: string;
      email?: string;
      phone: string;
      profileImage?: string;
      bio?: string;
      gender?: string;
    };

    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      bio: user.bio,
      gender: user.gender,
    };
  }

  @ApiOperation({
    summary: "Get New AccessToken",
    description:
      "In this route, the refresh token must be sent via cookies, not in the headers. The cookie named refreshToken is stored as HttpOnly in the browser and must be included with the request.",
  })
  @Post("/refresh-token")
  refreshToken(@Req() req: Request) {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید.");
    }
    return this.authService.refreshToken(token);
  }

  @ApiOperation({ summary: "Logout" })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Post("/logout")
  logout(@Req() req: Request) {
    const userId = req.user?.id;
    return this.authService.logout(userId!);
  }

  @ApiOperation({ summary: "Test this route with your browser,not swagger." })
  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {}

  @ApiOperation({ summary: "Test this route with your browser,not swagger." })
  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req: Request) {
    const { user } = req.user as any;
    return this.authService.findOrCreateUserByGoogleEmail({
      email: user?.email,
      name: user?.name,
      profileImage: user?.profileImage,
    });
  }
}
