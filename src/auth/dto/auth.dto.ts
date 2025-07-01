import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber } from "class-validator";

export class OtpDto {
  @IsPhoneNumber("IR", {
    message: "شماره تلفن باید 11 رقم داشته باشد و با 09 شروع شود.",
  })
  @ApiProperty({ example: "09123456789" })
  phone: string;
}
