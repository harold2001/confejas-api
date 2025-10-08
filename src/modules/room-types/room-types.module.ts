import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypesService } from './room-types.service';
import { RoomTypesController } from './room-types.controller';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';
import { RoomTypeRepository } from './repositories/room-types.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType])],
  controllers: [RoomTypesController],
  providers: [RoomTypesService, RoomTypeRepository],
  exports: [RoomTypeRepository],
})
export class RoomTypesModule {}
