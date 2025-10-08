import { BaseModel } from '@app/core/models/base.model';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'floors' })
export class Floor extends BaseModel {
  @Column()
  number: number;

  @ManyToOne(() => Building, (building) => building.floors, {
    onDelete: 'CASCADE',
  })
  building: Building;

  @OneToMany(() => Room, (room) => room.floor)
  rooms: Room[];
}
