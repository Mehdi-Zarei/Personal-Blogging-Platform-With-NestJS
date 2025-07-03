import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @Length(3, 20)
  @IsNotEmpty()
  @ApiProperty({ example: "برنامه نویسی" })
  title: string;
}
