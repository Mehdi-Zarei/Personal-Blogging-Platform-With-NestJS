import { Controller, Body, Get, UseGuards, Query, DefaultValuePipe, ParseIntPipe, Param, Patch, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Request } from "express";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Roles("ADMIN")
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin can get all users with pagination(without password)." })
  @ApiQuery({ name: "page", required: false, description: "صفحه مورد نظر" })
  @ApiQuery({ name: "limit", required: false, description: "تعداد آیتم‌ها در هر صفحه" })
  @Get("/")
  getAll(@Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number, @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.userService.getAll(page, limit);
  }

  @UseGuards(AuthGuard)
  @Roles("ADMIN")
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin can get main user." })
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles("ADMIN")
  @ApiBearerAuth("accessToken")
  @Patch(":id")
  @ApiOperation({ summary: "Admin can ban or lifting the ban users." })
  toggleBanStatus(@Param("id", ParseIntPipe) id: number) {
    return this.userService.toggleBanStatus(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.JSON, SwaggerConsumes.FORM)
  @ApiOperation({ summary: "User Can Update Their Profile." })
  @Patch()
  updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user!.id;

    return this.userService.updateProfile(userId, updateUserDto);
  }
}
