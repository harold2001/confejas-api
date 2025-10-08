import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { BuildingsSeedService } from './buildings-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Building])],
  providers: [BuildingsSeedService],
  exports: [BuildingsSeedService],
})
export class BuildingSeedModule {}
