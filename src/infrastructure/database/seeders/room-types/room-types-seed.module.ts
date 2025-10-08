import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';
import { RoomTypesSeedService } from './room-types-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType])],
  providers: [RoomTypesSeedService],
  exports: [RoomTypesSeedService],
})
export class RoomTypeSeedModule {}
