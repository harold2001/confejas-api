import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { buildingsData } from './buildings-seed.data';

@Injectable()
export class BuildingsSeedService {
  private readonly logger = new Logger(BuildingsSeedService.name);

  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async seed(): Promise<Building[]> {
    const createdBuildings: Building[] = [];

    for (const buildingData of buildingsData) {
      // Check if building already exists
      const existingBuilding = await this.buildingRepository.findOne({
        where: { name: buildingData.name },
      });

      if (existingBuilding) {
        this.logger.log(
          `Building '${buildingData.name}' already exists, skipping...`,
        );
        createdBuildings.push(existingBuilding);
        continue;
      }

      // Create new building
      const building = this.buildingRepository.create(buildingData);
      const savedBuilding = await this.buildingRepository.save(building);
      createdBuildings.push(savedBuilding);

      this.logger.log(`✅ Created building: ${savedBuilding.name}`);
    }

    this.logger.log(
      `Buildings seeding completed. Total: ${createdBuildings.length}`,
    );
    return createdBuildings;
  }
}
