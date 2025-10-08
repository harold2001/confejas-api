import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { BuildingRepository } from './repositories/buildings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Building])],
  controllers: [BuildingsController],
  providers: [BuildingsService, BuildingRepository],
  exports: [BuildingRepository],
})
export class BuildingsModule {}
