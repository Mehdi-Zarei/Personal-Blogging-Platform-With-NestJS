import { Module } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "./entities/article.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { LikeEntity } from "./entities/like.entity";
import { BookmarkEntity } from "./entities/bookmark.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, LikeEntity, BookmarkEntity]), AuthModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
