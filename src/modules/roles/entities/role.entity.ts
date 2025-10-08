import { BaseModel } from '@app/core/models/base.model';
import { User } from '@app/modules/users/entities/user.entity';
import { Entity, Column, ManyToMany } from 'typeorm';

@Entity({ name: 'roles' })
export class Role extends BaseModel {
  @Column({ unique: true })
  name: string; // Admin, Counselor, Participant, Staff

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
