import { BaseEntity } from "src/common/abstract/base.entity";
import { Column, Entity } from "typeorm";

@Entity("category")
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;
}
