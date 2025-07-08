import { ArticleEntity } from "src/article/entities/article.entity";
import { BookmarkEntity } from "src/article/entities/bookmark.entity";
import { LikeEntity } from "src/article/entities/like.entity";
import { BaseEntity } from "src/common/abstract/base.entity";
import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";

@Entity("user")
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true, enum: ["Male", "Female"] })
  gender?: "Male" | "Female";

  @Column({ enum: ["ADMIN", "USER"] })
  role: string;

  @Column({ default: false })
  isRestrict: boolean;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user)
  bookmarks: BookmarkEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
