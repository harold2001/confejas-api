import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorsService } from './floors.service';
import { FloorsController } from './floors.controller';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { FloorRepository } from './repositories/floors.repository';
import { BuildingsModule } from '@app/modules/buildings/buildings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Floor]), BuildingsModule],
  controllers: [FloorsController],
  providers: [FloorsService, FloorRepository],
  exports: [FloorRepository],
})
export class FloorsModule {}
