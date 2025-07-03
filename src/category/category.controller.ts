import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Roles("ADMIN")
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin Can Create A Category." })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiOperation({ summary: "Get all categories with pagination." })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @ApiOperation({ summary: "Get main category with id." })
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles("ADMIN")
  @ApiOperation({ summary: "Find and update category." })
  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.FORM)
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @UseGuards(AuthGuard)
  @Roles("ADMIN")
  @ApiOperation({ summary: "remove category." })
  @ApiBearerAuth("accessToken")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
