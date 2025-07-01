import { BaseEntity } from "src/common/abstract/base.entity";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity("user")
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, enum: ["Male", "Female"] })
  gender: string;

  @Column({ enum: ["ADMIN", "USER"] })
  role: string;

  @Column({ default: false })
  isRestrict: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
