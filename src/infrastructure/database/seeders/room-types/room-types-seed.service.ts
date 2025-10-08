import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';
import { roomTypesData } from './room-types-seed.data';

@Injectable()
export class RoomTypesSeedService {
  private readonly logger = new Logger(RoomTypesSeedService.name);

  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
  ) {}

  async seed(): Promise<RoomType[]> {
    const createdRoomTypes: RoomType[] = [];

    for (const roomTypeData of roomTypesData) {
      // Check if room type already exists
      const existingRoomType = await this.roomTypeRepository.findOne({
        where: { name: roomTypeData.name },
      });

      if (existingRoomType) {
        this.logger.log(
          `Room type '${roomTypeData.name}' already exists, skipping...`,
        );
        createdRoomTypes.push(existingRoomType);
        continue;
      }

      // Create new room type
      const roomType = this.roomTypeRepository.create(roomTypeData);
      const savedRoomType = await this.roomTypeRepository.save(roomType);
      createdRoomTypes.push(savedRoomType);

      this.logger.log(`✅ Created room type: ${savedRoomType.name}`);
    }

    this.logger.log(
      `Room types seeding completed. Total: ${createdRoomTypes.length}`,
    );
    return createdRoomTypes;
  }
}
