import { BaseModel } from '@app/core/models/base.model';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: 'room_types' })
export class RoomType extends BaseModel {
  @Column()
  name: string; // e.g., "Single", "Double", "Suite"

  @OneToMany(() => Room, (room) => room.roomType)
  rooms: Room[];
}
