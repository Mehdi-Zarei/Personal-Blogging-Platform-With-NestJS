import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { OtpDto } from "./dto/auth.dto";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConsumes("application/x-www-form-urlencoded")
  @Post("/send")
  async send(@Body() otpDto: OtpDto) {
    return this.authService.send(otpDto);
  }

  @Post("/verify")
  async verify() {
    return this.authService.verify();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.authService.findOne(+id);
  }
}
