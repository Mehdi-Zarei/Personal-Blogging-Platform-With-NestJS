import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationResult } from "src/common/dto/pagination-result.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { title } = createCategoryDto;

    const isCategoryExist = await this.categoryRepository.findOneBy({ title });
    if (isCategoryExist) {
      throw new ConflictException("عنوان دسته بندی تکراری است.");
    }

    const newCategory = this.categoryRepository.create({ title });
    await this.categoryRepository.save(newCategory);

    return { message: "دسته بندی با موفقیت ایجاد گردید." };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const [category, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return new PaginationResult(category, total, page, limit);
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException("دسته بندی یافت نشد.");
    }

    return { category };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { title } = updateCategoryDto;

    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException("دسته بندی یافت نشد.");
    }

    if (title) category.title = title;
    await this.categoryRepository.save(category);

    return { message: "عنوان دسته بندی با موفقیت تغییر کرد." };
  }

  async remove(id: number) {
    const remove = await this.categoryRepository.delete({ id });
    if (!remove.affected) {
      throw new NotFoundException("دسته بندی یافت نشد.");
    }

    return { message: "دسته بندی با موفقیت حذف شد." };
  }
}
