import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { ArticleEntity } from "src/article/entities/article.entity";

@Entity("bookmarks")
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.bookmarks, { onDelete: "CASCADE" })
  user: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.bookmarks, { onDelete: "CASCADE" })
  article: ArticleEntity;
}
