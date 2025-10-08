import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';
import { roomsData } from './rooms-seed.data';

@Injectable()
export class RoomsSeedService {
  private readonly logger = new Logger(RoomsSeedService.name);

  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
  ) {}

  async seed(): Promise<Room[]> {
    const createdRooms: Room[] = [];

    for (const roomData of roomsData) {
      // Find the building
      const building = await this.buildingRepository.findOne({
        where: { name: roomData.buildingName },
      });

      if (!building) {
        this.logger.warn(
          `Building '${roomData.buildingName}' not found, skipping room ${roomData.roomNumber}`,
        );
        continue;
      }

      // Find the floor
      const floor = await this.floorRepository.findOne({
        where: {
          number: roomData.floorNumber,
          building: { id: building.id },
        },
        relations: ['building'],
      });

      if (!floor) {
        this.logger.warn(
          `Floor ${roomData.floorNumber} in ${roomData.buildingName} not found, skipping room ${roomData.roomNumber}`,
        );
        continue;
      }

      // Find the room type
      const roomType = await this.roomTypeRepository.findOne({
        where: { name: roomData.roomTypeName },
      });

      if (!roomType) {
        this.logger.warn(
          `Room type '${roomData.roomTypeName}' not found, skipping room ${roomData.roomNumber}`,
        );
        continue;
      }

      // Check if room already exists
      const existingRoom = await this.roomRepository.findOne({
        where: { roomNumber: roomData.roomNumber },
      });

      if (existingRoom) {
        this.logger.log(
          `Room ${roomData.roomNumber} already exists, skipping...`,
        );
        createdRooms.push(existingRoom);
        continue;
      }

      // Create new room
      const room = this.roomRepository.create({
        roomNumber: roomData.roomNumber,
        totalBeds: roomData.totalBeds,
        floor: floor,
        roomType: roomType,
      });

      const savedRoom = await this.roomRepository.save(room);
      createdRooms.push(savedRoom);

      this.logger.log(
        `✅ Created room ${savedRoom.roomNumber} (${roomType.name}) in ${building.name} Floor ${floor.number}`,
      );
    }

    this.logger.log(`Rooms seeding completed. Total: ${createdRooms.length}`);
    return createdRooms;
  }
}
