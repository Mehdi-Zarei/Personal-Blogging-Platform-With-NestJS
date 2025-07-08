import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString, Length } from "class-validator";

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 300)
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(100)
  content: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  timeForStudy: string;

  @ApiPropertyOptional({ format: "binary", isArray: true })
  images: string[];

  @ApiProperty({ enum: ["Publish", "Draft", "Unpublish"] })
  status: string;
}
