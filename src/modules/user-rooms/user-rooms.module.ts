import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoomsService } from './user-rooms.service';
import { UserRoomsController } from './user-rooms.controller';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';
import { User } from '@app/modules/users/entities/user.entity';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { UserRoomRepository } from './repositories/user-rooms.repository';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoom, User, Room]),
    RoomsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [UserRoomsController],
  providers: [UserRoomsService, UserRoomRepository],
  exports: [UserRoomRepository, UserRoomsService],
})
export class UserRoomsModule {}
