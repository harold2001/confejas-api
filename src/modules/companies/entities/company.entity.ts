import { BaseModel } from '@app/core/models/base.model';
import { User } from '@app/modules/users/entities/user.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: 'companies' })
export class Company extends BaseModel {
  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
