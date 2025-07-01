import { BadRequestException, Injectable } from "@nestjs/common";
import { OtpDto } from "./dto/auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { RedisService } from "src/redis/redis.service";
import { randomInt } from "crypto";
import { SmsService } from "src/sms/sms.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly redisService: RedisService,

    private readonly smsService: SmsService,
  ) {}

  async send(otpDto: OtpDto) {
    const { phone } = otpDto;

    const user = await this.userRepository.findOneBy({ phone });

    if (user && user.isRestrict) {
      throw new BadRequestException("این حساب کاربری توسط مدیر مسدود شده است.");
    }

    const storedOtp = await this.redisService.getKey(`otp:${phone}`);
    if (storedOtp) {
      throw new BadRequestException(
        "کد یکبارمصرف قبلا برای شما ارسال گردیده است.",
      );
    }

    const code = randomInt(10000, 99999);

    await this.redisService.setKey(`otp:${phone}`, code, 120);

    const sms = await this.smsService.sendSms(phone, code);
    if (sms.success) {
      return { message: "کد یکبار مصرف برای شما ارسال گردید." };
    } else {
      return { message: "خطا در ارسال کد یکبار مصرف!لطفا بعدا تلاش فرمائید." };
    }
  }

  async verify() {
    return `This action returns all auth`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
}
