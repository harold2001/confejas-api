import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';
import { RoomsSeedService } from './rooms-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Floor, Building, RoomType])],
  providers: [RoomsSeedService],
  exports: [RoomsSeedService],
})
export class RoomSeedModule {}
