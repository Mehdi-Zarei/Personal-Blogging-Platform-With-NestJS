import { BaseEntity } from "src/common/abstract/base.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { AfterLoad, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BookmarkEntity } from "./bookmark.entity";
import { LikeEntity } from "./like.entity";
import { map } from "rxjs";

@Entity("article")
export class ArticleEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  timeForStudy: string;

  @Column({ type: "enum", enum: ["Publish", "Draft", "Unpublish"], default: "Draft" })
  status: string;

  @Column("text", { nullable: true, array: true })
  images: string[];

  @ManyToOne(() => UserEntity, (user) => user.articles)
  author: UserEntity;

  @OneToMany(() => LikeEntity, (like) => like.article)
  likes: LikeEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.article)
  bookmarks: BookmarkEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
