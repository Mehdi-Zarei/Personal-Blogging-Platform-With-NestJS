import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class OtpDto {
  @IsPhoneNumber("IR", {
    message: "شماره تلفن باید 11 رقم داشته باشد و با 09 شروع شود.",
  })
  @IsNotEmpty({ message: "شماره موبایل نمیتواند خالی باشد." })
  @ApiProperty({ example: "09123456789" })
  phone: string;
}

export class VerifyOtpDto {
  @IsPhoneNumber("IR", {
    message: "شماره تلفن باید 11 رقم داشته باشد و با 09 شروع شود.",
  })
  @IsNotEmpty({ message: "شماره موبایل نمیتواند خالی باشد." })
  @ApiProperty({ example: "09123456789" })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: "کد یکبارمصرف نمیخواتد خالی باشد." })
  @ApiProperty({ example: "12345" })
  code: string;
}

export class RegisterDto {
  @IsNotEmpty({ message: "نام نمیتواند خالی باشد." })
  @Length(3, 20, { message: "نام شما باید حداقل 3 و حداکثر 20 کاراکتر طول داشته باشد." })
  @IsString({ message: "نام شما باید به حروف باشد." })
  @ApiProperty({ example: "Mehdi", description: "نام کاربر" })
  name: string;

  @IsEmail({}, { message: "لطفا یک ایمیل معتبر وارد کنید." })
  @IsOptional()
  @ApiPropertyOptional({ example: "user@example.com", description: "ایمیل معتبر کاربر" })
  email?: string;

  @IsPhoneNumber("IR", {
    message: "شماره تلفن باید 11 رقم داشته باشد و با 09 شروع شود.",
  })
  @IsNotEmpty()
  @ApiProperty({ example: "09123456789", description: "شماره موبایل با کد ایران" })
  phone: string;

  @IsOptional()
  @Length(8, 50, { message: "رمز عبور بایستی حداقل 8 حرف داشته باشد." })
  @ApiPropertyOptional({ example: "mypassword123", description: "رمز عبور امن" })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: "profile.jpg",
    description: "آدرس تصویر پروفایل",
    required: false,
  })
  profileImage?: string;

  @IsOptional()
  @IsString()
  @Length(10, 200, { message: "بیوگرافی باید حداقل 10 و حداکثر 200 کاراکتر باشد." })
  @ApiPropertyOptional({
    example: "من یک توسعه‌دهنده هستم.",
    description: "توضیحی در مورد کاربر",
    required: false,
  })
  bio?: string;

  @ApiPropertyOptional({
    example: "Male",
    description: "جنسیت کاربر",
    enum: ["Male", "Female"],
  })
  @IsEnum(["Male", "Female"], { message: "جنسیت باید مرد یا زن باشد." })
  gender: "Male" | "Female";
}
