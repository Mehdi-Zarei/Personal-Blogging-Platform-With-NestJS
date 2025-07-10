import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class CustomAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("توکن ارسال نشده است.");
    }

    let decoded: any;
    try {
      decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException("توکن معتبر نیست یا منقضی شده است.");
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new UnauthorizedException("کاربر یافت نشد.");
    }

    const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException("شما اجازه دسترسی به این مسیر را ندارید.");
    }

    request.user = user;
    return true;
  }
}
