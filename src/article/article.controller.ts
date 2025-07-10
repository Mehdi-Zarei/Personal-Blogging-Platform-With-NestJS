import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe, Put, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { Request } from "express";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/upload/multer.config";

@ApiTags("Article")
@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(CustomAuthGuard)
  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiOperation({ summary: "Create Article" })
  @ApiBearerAuth("accessToken")
  @UseInterceptors(FilesInterceptor("image", 10, multerConfig("public/images/article/", 2, [".jpg", ".jpeg", ".png"])))
  @Post("/")
  create(@Body() createArticleDto: CreateArticleDto, @Req() req: Request, @UploadedFiles() file: Express.Multer.File[]) {
    const userId = req.user!.id;
    return this.articleService.create(createArticleDto, userId, file);
  }

  @ApiOperation({ summary: "Get All Blogs." })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "search", required: false })
  @Get("/")
  findAll(@Query() paginationDto: PaginationDto) {
    return this.articleService.findAll(paginationDto);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @ApiOperation({ summary: "User Can Get Their Articles." })
  @Get("/my-blogs")
  myBlogs(@Req() req: Request) {
    const userId = req.user!.id;
    return this.articleService.myBlogs(userId);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @ApiOperation({ summary: "User Can Update Their Articles." })
  @ApiConsumes(SwaggerConsumes.FORM)
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto, @Req() req: Request) {
    const userId = req.user!.id;
    return this.articleService.update(id, updateArticleDto, userId);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @ApiOperation({ summary: "User Can Remove Their Articles." })
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user!.id;
    return this.articleService.remove(id, userId);
  }

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "User Can Like/Unlike Articles." })
  @Put("like/:id")
  likeToggle(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user!.id;
    return this.articleService.likeToggle(id, userId);
  }

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "User Can Save/Unsave Articles." })
  @Put("bookmark/:id")
  bookmarkToggle(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user!.id;
    return this.articleService.bookmarkToggle(id, userId);
  }

  @ApiOperation({ summary: "Get One Article." })
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.articleService.getOne(id);
  }
}
