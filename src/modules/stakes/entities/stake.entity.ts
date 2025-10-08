import { BaseModel } from '@app/core/models/base.model';
import { User } from '@app/modules/users/entities/user.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: 'stakes' })
export class Stake extends BaseModel {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.stake)
  users: User[];
}
