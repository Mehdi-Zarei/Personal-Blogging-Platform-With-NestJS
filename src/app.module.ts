import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./config/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SmsModule } from "./sms/sms.module";
import { RedisModule } from "./redis/redis.module";
import { CategoryModule } from "./category/category.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), AuthModule, UserModule, SmsModule, RedisModule, CategoryModule, JwtModule],
  controllers: [],
  providers: [],
  exports: [JwtModule],
})
export class AppModule {}
