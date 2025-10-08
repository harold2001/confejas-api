import { BaseModel } from '@app/core/models/base.model';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'rooms' })
export class Room extends BaseModel {
  @Column({ unique: true })
  roomNumber: string;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms, { eager: true })
  roomType: RoomType;

  @ManyToOne(() => Floor, (floor) => floor.rooms, { onDelete: 'CASCADE' })
  floor: Floor;

  @Column({ type: 'int', default: 1 })
  totalBeds: number;

  @OneToMany(() => UserRoom, (userRoom) => userRoom.room)
  userRooms: UserRoom[];
}
