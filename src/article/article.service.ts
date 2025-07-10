import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleEntity } from "./entities/article.entity";
import { Brackets, Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationResult } from "src/common/dto/pagination-result.dto";
import { LikeEntity } from "./entities/like.entity";
import { BookmarkEntity } from "./entities/bookmark.entity";

@Injectable()
export class ArticleService {
  @InjectRepository(ArticleEntity)
  private readonly articleRepository: Repository<ArticleEntity>;

  @InjectRepository(LikeEntity)
  private readonly likeRepository: Repository<LikeEntity>;

  @InjectRepository(BookmarkEntity)
  private readonly bookmarkRepository: Repository<BookmarkEntity>;

  async create(createArticleDto: CreateArticleDto, userId: number, file: Express.Multer.File[]) {
    let { title, description, content, images, status, timeForStudy } = createArticleDto;

    let slug = title
      .replace(/[^\w\u0600-\u06FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    const isSlugRepetitive = await this.articleRepository.findOneBy({ slug });
    if (isSlugRepetitive) {
      slug += `-${Math.random().toString(36).substring(2)}`;
    }

    if (file && file.length > 0) {
      images = file.map((img) => `${process.env.DOMAIN}/images/article/${img.filename}`);
    }

    const newArticle = this.articleRepository.create({
      title,
      description,
      content,
      images,
      slug,
      status,
      timeForStudy,
      author: { id: userId },
    });

    await this.articleRepository.save(newArticle);

    return { message: "مقاله با موفقیت ساخته شد." };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;

    const queryBuilder = this.articleRepository.createQueryBuilder("article");

    queryBuilder
      .leftJoin("article.author", "author")
      .addSelect(["author.name"])
      .loadRelationCountAndMap("article.likesCount", "article.likes")
      .loadRelationCountAndMap("article.bookmarksCount", "article.bookmarks");

    if (search) {
      const keywords = search.split(" ").filter(Boolean);

      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const keyword of keywords) {
            qb.orWhere("article.title ILIKE :kw", { kw: `%${keyword}%` })
              .orWhere("article.description ILIKE :kw", { kw: `%${keyword}%` })
              .orWhere("article.content ILIKE :kw", { kw: `%${keyword}%` })
              .orWhere("article.slug ILIKE :kw", { kw: `%${keyword}%` });
          }
        }),
      );
    }

    queryBuilder
      .orderBy("article.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [articles, total] = await queryBuilder.getManyAndCount();

    if (total === 0) {
      throw new NotFoundException("مقاله‌ای یافت نشد.");
    }

    return new PaginationResult(articles, total, page, limit);
  }

  async myBlogs(userId: number) {
    const blogs = await this.articleRepository.find({
      where: {
        author: { id: userId },
      },
      order: { id: "DESC" },
      select: ["id", "title", "status", "images"],
    });

    if (!blogs.length) {
      throw new NotFoundException("مقاله ای یافت نشد.");
    }

    return { blogs };
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, userId: number) {
    const { title, description, content, images, status, timeForStudy } = updateArticleDto;

    const article = await this.articleRepository.findOne({
      where: {
        id,
        author: { id: userId },
      },
    });

    if (!article) {
      throw new BadRequestException("مقاله یافت نشد و یا شما ایجاد کننده مقاله نمی باشید.");
    }

    if (title) {
      article.title = title;
      article.slug =
        title
          .replace(/[^\w\u0600-\u06FF\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "")
          .toLowerCase() + `-${Math.random().toString(36).substring(2)}`;
    }

    if (description) article.description = description;
    if (content) article.content = content;
    if (images) article.images = images;
    if (status) article.status = status;
    if (timeForStudy) article.timeForStudy = timeForStudy;

    await this.articleRepository.save(article);

    return { message: "مقاله با موفقیت بروز رسانی گردید." };
  }

  async remove(id: number, userId: number) {
    const remove = await this.articleRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!remove) {
      throw new NotFoundException("مقاله ای یافت نشد.");
    }

    if (remove.author.id !== userId) {
      throw new BadRequestException("شما مجاز به حذف این مقاله نیستید.");
    }

    await this.articleRepository.delete(id);

    return { message: "مقاله با موفقیت حذف گردید." };
  }

  async likeToggle(id: number, userId: number) {
    const isArticleExist = await this.articleRepository.findOneBy({ id, status: "Publish" });
    if (!isArticleExist) {
      throw new NotFoundException("مقاله ای یافت نشد.");
    }

    const isLiked = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        article: { id },
      },
    });

    let message: string = "مقاله با موفقیت لایک شد.";

    if (isLiked) {
      await this.likeRepository.delete(isLiked.id);
      message = "لایک مقاله با موفقیت برداشته شد.";
    } else {
      await this.likeRepository.insert({ user: { id: userId }, article: { id } });
    }

    return { message };
  }

  async bookmarkToggle(id: number, userId: number) {
    const isArticleExist = await this.articleRepository.findOneBy({ id, status: "Publish" });
    if (!isArticleExist) {
      throw new NotFoundException("مقاله ای یافت نشد.");
    }

    const isBookmarked = await this.bookmarkRepository.findOne({
      where: {
        user: { id: userId },
        article: { id },
      },
    });

    let message: string = "مقاله با موفقیت ذخیره شد.";

    if (isBookmarked) {
      await this.bookmarkRepository.delete({ user: { id: userId }, article: { id } });
      message = "مقاله از لیست ذخیره ها حذف شد.";
    } else {
      await this.bookmarkRepository.insert({ user: { id: userId }, article: { id } });
    }

    return { message };
  }

  async getOne(id: number) {
    const article = await this.articleRepository
      .createQueryBuilder("article")
      .leftJoin("article.author", "author")
      .addSelect(["author.name"])
      .loadRelationCountAndMap("article.likesCount", "article.likes")
      .loadRelationCountAndMap("article.bookmarksCount", "article.bookmarks")
      .where("article.id = :id AND article.status = :status", { id, status: "Publish" })
      .getOne();

    if (!article) {
      throw new NotFoundException("مقاله‌ای با این شناسه یافت نشد.");
    }

    const suggestions = await this.articleRepository
      .createQueryBuilder("article")
      .where("article.id != :id AND article.status = :status", { id, status: "Publish" })
      .orderBy("RANDOM()")
      .limit(3)
      .getMany();

    return { article, suggestions };
  }
}
