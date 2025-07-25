import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { HashService } from "src/auth/bcrypt.service";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly hashService: HashService,
  ) {}

  async getAll(page: number, limit: number) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });

    if (total === 0) {
      throw new NotFoundException("کاربری یافت نشد.");
    }

    return {
      data: users,
      total,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("کاربری یافت نشد.");
    }

    return { user };
  }

  async toggleBanStatus(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("کاربر یافت نشد.");
    }

    user.isRestrict = !user.isRestrict;

    await this.userRepository.save(user);

    return {
      message: user.isRestrict ? " کاربر با موفقیت بن شد." : "بن کاربر با موفقیت برداشته شد. ",
    };
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const { name, email, gender, bio, password } = updateUserDto;

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException("کاربر یافت نشد.");
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
    if (password) user.password = await this.hashService.hashData(password);

    await this.userRepository.save(user);

    return { message: "پروفایل شما با موفقیت آپدیت شد." };
  }

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("کاربر یافت نشد.");
    }

    if (user.profileImage) {
      const filename = path.basename(user.profileImage);
      const oldPath = path.join("public/images/users-profile", filename);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.profileImage = `${process.env.DOMAIN}/${file.path.slice(7)}`;
    await this.userRepository.save(user);

    return { message: "عکس پروفایل با موفقیت آپلود شد." };
  }

  async removeAvatar(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("کاربر یافت نشد.");
    }

    if (user.profileImage === "null") {
      throw new NotFoundException("پروفایل شما فاقد عکس می باشد.");
    }

    const oldPath = path.join(`public/${user.profileImage}`);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    user.profileImage = "null";
    await this.userRepository.save(user);

    return { message: "عکس پروفایل شما با موفقیت حذف گردید." };
  }
}
