import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';
import { User } from '@app/modules/users/entities/user.entity';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { UserRoomsSeedService } from './user-rooms-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoom, User, Room])],
  providers: [UserRoomsSeedService],
  exports: [UserRoomsSeedService],
})
export class UserRoomSeedModule {}
