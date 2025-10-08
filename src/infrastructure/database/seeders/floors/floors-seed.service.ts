import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { floorsData } from './floors-seed.data';

@Injectable()
export class FloorsSeedService {
  private readonly logger = new Logger(FloorsSeedService.name);

  constructor(
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async seed(): Promise<Floor[]> {
    const createdFloors: Floor[] = [];

    for (const floorData of floorsData) {
      // Find the building for this floor
      const building = await this.buildingRepository.findOne({
        where: { name: floorData.buildingName },
      });

      if (!building) {
        this.logger.warn(
          `Building '${floorData.buildingName}' not found, skipping floor ${floorData.number}`,
        );
        continue;
      }

      // Check if floor already exists for this building
      const existingFloor = await this.floorRepository.findOne({
        where: {
          number: floorData.number,
          building: { id: building.id },
        },
        relations: ['building'],
      });

      if (existingFloor) {
        this.logger.log(
          `Floor ${floorData.number} in ${floorData.buildingName} already exists, skipping...`,
        );
        createdFloors.push(existingFloor);
        continue;
      }

      // Create new floor
      const floor = this.floorRepository.create({
        number: floorData.number,
        building: building,
      });

      const savedFloor = await this.floorRepository.save(floor);
      createdFloors.push(savedFloor);

      this.logger.log(
        `✅ Created floor ${savedFloor.number} in ${building.name}`,
      );
    }

    this.logger.log(`Floors seeding completed. Total: ${createdFloors.length}`);
    return createdFloors;
  }
}
