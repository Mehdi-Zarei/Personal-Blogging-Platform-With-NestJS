import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UploadAvatarDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "profile.jpg",
    description: "آدرس تصویر پروفایل",
    required: true,
    format: "binary",
  })
  profileImage?: string;
}
