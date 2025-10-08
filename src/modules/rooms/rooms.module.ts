import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';
import { RoomRepository } from './repositories/rooms.repository';
import { FloorsModule } from '../floors/floors.module';
import { RoomTypesModule } from '../room-types/room-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Floor, RoomType]),
    FloorsModule,
    RoomTypesModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository],
  exports: [RoomRepository],
})
export class RoomsModule {}
