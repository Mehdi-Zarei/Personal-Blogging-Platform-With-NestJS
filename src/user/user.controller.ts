import { Controller, Body, Get, UseGuards, Query, DefaultValuePipe, ParseIntPipe, Param, Patch, Req, Post, UseInterceptors, UploadedFile, HttpCode, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Request } from "express";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/upload/multer.config";
import { UploadAvatarDto } from "./dto/upload-avatar.dto";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin can get all users with pagination(without password)." })
  @ApiQuery({ name: "page", required: false, description: "صفحه مورد نظر" })
  @ApiQuery({ name: "limit", required: false, description: "تعداد آیتم‌ها در هر صفحه" })
  @Get("/")
  getAll(@Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number, @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.userService.getAll(page, limit);
  }

  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin can get main user." })
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getOne(id);
  }

  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiBearerAuth("accessToken")
  @Patch(":id")
  @ApiOperation({ summary: "Admin can ban or lifting the ban users." })
  toggleBanStatus(@Param("id", ParseIntPipe) id: number) {
    return this.userService.toggleBanStatus(id);
  }

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiOperation({ summary: "User Can Update Their Profile." })
  @Patch()
  updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user!.id;

    return this.userService.updateProfile(userId, updateUserDto);
  }

  @ApiOperation({ summary: "Upload profile avatar." })
  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiBody({ type: UploadAvatarDto })
  @HttpCode(200)
  @UseGuards(CustomAuthGuard)
  @UseInterceptors(FileInterceptor("profileImage", multerConfig("public/images/users-profile/", 2, [".jpg", ".jpeg", ".png"])))
  @Post("upload-avatar")
  uploadAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user!.id;

    return this.userService.uploadAvatar(userId, file);
  }

  @ApiOperation({ summary: "Remove profile avatar." })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Delete("remove-avatar")
  removeAvatar(@Req() req: Request) {
    const userId = req.user!.id;
    return this.userService.removeAvatar(userId);
  }
}
