import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { ArticleEntity } from "src/article/entities/article.entity";

@Entity("likes")
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: "CASCADE" })
  user: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.likes, { onDelete: "CASCADE" })
  article: ArticleEntity;
}
