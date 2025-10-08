import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { FloorRepository } from './repositories/floors.repository';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { BuildingRepository } from '@app/modules/buildings/repositories/buildings.repository';

@Injectable()
export class FloorsService {
  constructor(
    private readonly floorRepository: FloorRepository,
    private readonly buildingRepository: BuildingRepository,
  ) {}

  async create(createFloorDto: CreateFloorDto): Promise<Floor> {
    const { buildingId, ...floorData } = createFloorDto;

    const building = await this.buildingRepository.findById(buildingId);
    if (!building) {
      throw new NotFoundException(`Building with ID ${buildingId} not found`);
    }

    const floor = await this.floorRepository.create({
      ...floorData,
      building,
    });
    return floor;
  }

  async findAll(): Promise<Floor[]> {
    return this.floorRepository.findAll();
  }

  async findOne(id: string): Promise<Floor> {
    return this.floorRepository.findById(id);
  }

  async update(id: string, updateFloorDto: UpdateFloorDto): Promise<Floor> {
    const { buildingId, ...floorData } = updateFloorDto;

    const updateData: any = { ...floorData };

    if (buildingId) {
      const building = await this.buildingRepository.findById(buildingId);
      if (!building) {
        throw new NotFoundException(`Building with ID ${buildingId} not found`);
      }
      updateData.building = building;
    }

    return this.floorRepository.update(id, updateData);
  }

  async remove(id: string): Promise<Floor> {
    return this.floorRepository.delete(id);
  }
}
