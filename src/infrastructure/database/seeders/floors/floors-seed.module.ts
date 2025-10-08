import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { FloorsSeedService } from './floors-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Floor, Building])],
  providers: [FloorsSeedService],
  exports: [FloorsSeedService],
})
export class FloorSeedModule {}
