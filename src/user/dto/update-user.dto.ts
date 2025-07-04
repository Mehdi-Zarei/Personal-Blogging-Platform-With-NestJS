import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
  @Length(3, 20, { message: "نام شما باید حداقل 3 و حداکثر 20 کاراکتر طول داشته باشد." })
  @IsString({ message: "نام شما باید به حروف باشد." })
  @IsOptional()
  @ApiPropertyOptional({ example: "Mehdi", description: "نام کاربر" })
  name?: string;

  @IsEmail({}, { message: "لطفا یک ایمیل معتبر وارد کنید." })
  @IsOptional()
  @ApiPropertyOptional({ example: "user@example.com", description: "ایمیل معتبر کاربر" })
  email?: string;

  @IsOptional()
  @Length(8, 50, { message: "رمز عبور بایستی حداقل 8 حرف داشته باشد." })
  @ApiPropertyOptional({ example: "mypassword123", description: "رمز عبور امن" })
  password?: string;

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
  @IsOptional()
  gender?: "Male" | "Female";
}
