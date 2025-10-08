import { BaseModel } from '@app/core/models/base.model';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: 'buildings' })
export class Building extends BaseModel {
  @Column()
  name: string;

  @OneToMany(() => Floor, (floor) => floor.building)
  floors: Floor[];
}
