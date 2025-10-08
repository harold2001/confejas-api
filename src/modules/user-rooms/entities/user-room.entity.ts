import { BaseModel } from '@app/core/models/base.model';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { User } from '@app/modules/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'user_rooms' })
export class UserRoom extends BaseModel {
  @ManyToOne(() => User, (user) => user.userRooms, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Room, (room) => room.userRooms, { onDelete: 'CASCADE' })
  room: Room;
}
