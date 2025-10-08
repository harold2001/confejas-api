import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomRepository } from './repositories/rooms.repository';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { FloorRepository } from '@app/modules/floors/repositories/floors.repository';
import { RoomTypeRepository } from '@app/modules/room-types/repositories/room-types.repository';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly floorRepository: FloorRepository,
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const { floorId, roomTypeId, ...roomData } = createRoomDto;

    const floor = await this.floorRepository.findById(floorId);
    if (!floor) {
      throw new NotFoundException(`Floor with ID ${floorId} not found`);
    }

    const roomType = await this.roomTypeRepository.findById(roomTypeId);
    if (!roomType) {
      throw new NotFoundException(`Room type with ID ${roomTypeId} not found`);
    }

    const room = await this.roomRepository.create({
      ...roomData,
      floor,
      roomType,
    });
    return room;
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.findAll();
  }

  async findOne(id: string): Promise<Room> {
    return this.roomRepository.findById(id);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const { floorId, roomTypeId, ...roomData } = updateRoomDto;

    const updateData: any = { ...roomData };

    if (floorId) {
      const floor = await this.floorRepository.findById(floorId);
      if (!floor) {
        throw new NotFoundException(`Floor with ID ${floorId} not found`);
      }
      updateData.floor = floor;
    }

    if (roomTypeId) {
      const roomType = await this.roomTypeRepository.findById(roomTypeId);
      if (!roomType) {
        throw new NotFoundException(
          `Room type with ID ${roomTypeId} not found`,
        );
      }
      updateData.roomType = roomType;
    }

    return this.roomRepository.update(id, updateData);
  }

  async remove(id: string): Promise<Room> {
    return this.roomRepository.delete(id);
  }
}
