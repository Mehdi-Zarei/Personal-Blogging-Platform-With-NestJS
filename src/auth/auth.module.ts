import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { RedisService } from "src/redis/redis.service";
import { SmsService } from "src/sms/sms.service";
import { HttpModule } from "@nestjs/axios";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TokenService } from "./token.service";
import { HashService } from "./dto/bcrypt.service";
import { AuthGuard } from "src/common/guards/auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HttpModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, RedisService, SmsService, JwtService, TokenService, HashService, AuthGuard],
  exports: [AuthGuard, JwtModule, TypeOrmModule],
})
export class AuthModule {}
