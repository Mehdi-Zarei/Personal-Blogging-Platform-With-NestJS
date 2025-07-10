import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { OtpDto, RegisterDto, VerifyOtpDto } from "./dto/auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { RedisService } from "src/redis/redis.service";
import { randomInt } from "crypto";
import { SmsService } from "src/sms/sms.service";
import { TokenService } from "./token.service";
import { HashService } from "./dto/bcrypt.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly redisService: RedisService,

    private readonly smsService: SmsService,

    private readonly tokenService: TokenService,

    private readonly hashService: HashService,
  ) {}

  async send(otpDto: OtpDto) {
    const { phone } = otpDto;

    const user = await this.userRepository.findOneBy({ phone });

    if (user && user.isRestrict) {
      throw new BadRequestException("این حساب کاربری توسط مدیر مسدود شده است.");
    }

    const storedOtp = await this.redisService.getKey(`otp:${phone}`);
    if (storedOtp) {
      throw new BadRequestException("کد یکبارمصرف قبلا برای شما ارسال گردیده است.");
    }

    const code = randomInt(10000, 99999);

    await this.redisService.setKey(`otp:${phone}`, code, 120);

    const sms = await this.smsService.sendSms(phone, code);
    if (sms.success) {
      return { message: "کد یکبار مصرف برای شما ارسال گردید." };
    } else {
      throw new InternalServerErrorException("خطا در ارسال کد یکبار مصرف!لطفا بعدا تلاش فرمائید.");
    }
  }

  async verify(verifyOtpDto: VerifyOtpDto) {
    const { phone, code } = verifyOtpDto;

    const storedCode = await this.redisService.getKey(`otp:${phone}`);
    if (!storedCode || storedCode !== code) {
      throw new UnauthorizedException("کد وارد شده صحیح نبوده و یا منقضی شده است.");
    }

    const isUserExist = await this.userRepository.findOneBy({ phone });
    if (isUserExist) {
      const accessToken = this.tokenService.createAccessToken({ id: isUserExist.id, role: isUserExist.role });

      const refreshToken = this.tokenService.createRefreshToken({ id: isUserExist.id, role: isUserExist.role });

      const hashedRefreshToken = await this.hashService.hashData(refreshToken);

      await this.redisService.removeKey(`otp:${phone}`);
      await this.redisService.setKey(`refreshToken:${isUserExist.id}`, hashedRefreshToken, 2592000);

      return {
        message: "شما با موفقیت وارد حساب کاربری خود شدید.",
        accessToken,
        refreshToken,
      };
    } else {
      return {
        status: "NOT_REGISTERED",
        redirect: "/api/auth/register",
        message: "کاربر حسابی ندارد. به صفحه ثبت‌نام منتقل شود.",
      };
    }
  }

  async register(registerDto: RegisterDto) {
    const { name, phone, email, password, gender, bio } = registerDto;

    const isUserExist = await this.userRepository.findOne({ where: [{ phone }, { email }] });
    if (isUserExist) {
      if (isUserExist.phone) {
        throw new UnauthorizedException("این شماره موبایل تکراری می باشد.");
      } else if (isUserExist.email) {
        throw new UnauthorizedException("این آدرس ایمیل تکراری می باشد.");
      }
    }

    const isFirstUser = (await this.userRepository.count()) === 0;

    const newUser = this.userRepository.create({
      name,
      phone,
      email,
      password: password ? await this.hashService.hashData(password) : undefined,
      bio,
      gender,
      isRestrict: false,
      role: isFirstUser ? "ADMIN" : "USER",
    });
    await this.userRepository.save(newUser);

    const accessToken = this.tokenService.createAccessToken({ id: newUser.id, role: newUser.role });

    const refreshToken = this.tokenService.createRefreshToken({ id: newUser.id, role: newUser.role });

    const hashedRefreshToken = await this.hashService.hashData(refreshToken);
    await this.redisService.setKey(`refreshToken:${newUser.id}`, hashedRefreshToken, 2592000);

    return {
      message: "حساب کاربری با موفقیت ساخته شد.",
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    const payload = await this.tokenService.verifyToken(token, process.env.REFRESH_TOKEN_SECRET);

    if (!payload) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید.");
    }

    const storedHashedToken = await this.redisService.getKey(`refreshToken:${payload.id}`);
    if (!storedHashedToken) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید.");
    }

    const compareToken = await this.hashService.compareData(token, storedHashedToken);
    if (!compareToken) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید.");
    }

    const newAccessToken = this.tokenService.createAccessToken({ id: payload.id, role: payload.role });

    return { newAccessToken };
  }

  async logout(userId: number) {
    const remove = await this.redisService.removeKey(`refreshToken:${userId}`);
    if (!remove) {
      throw new UnauthorizedException("شما وارد حساب کاربری خود نیستید!");
    }

    return { message: "با موفقیت از حساب کاربری خود خارج شدید." };
  }

  async findOrCreateUserByGoogleEmail({ email, name, profileImage }: { email: string; name: string; profileImage?: string }) {
    let user = await this.userRepository.findOneBy({ email });
    if (!user) {
      user = this.userRepository.create({ email, name, role: "USER", profileImage });
    }

    await this.userRepository.save(user);

    const accessToken = this.tokenService.createAccessToken({ id: user.id, role: user.role });
    const refreshToken = this.tokenService.createRefreshToken({ id: user.id, role: user.role });

    return { accessToken, refreshToken };
  }
}
