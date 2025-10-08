import { Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { BuildingRepository } from './repositories/buildings.repository';
import { Building } from '@app/modules/buildings/entities/building.entity';

@Injectable()
export class BuildingsService {
  constructor(private readonly buildingRepository: BuildingRepository) {}

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const building = await this.buildingRepository.create(createBuildingDto);
    return building;
  }

  async findAll(): Promise<Building[]> {
    return this.buildingRepository.findAll();
  }

  async findOne(id: string): Promise<Building> {
    return this.buildingRepository.findById(id);
  }

  async update(
    id: string,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    return this.buildingRepository.update(id, updateBuildingDto);
  }

  async remove(id: string): Promise<Building> {
    return this.buildingRepository.delete(id);
  }
}
