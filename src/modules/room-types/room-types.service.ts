import { Injectable } from '@nestjs/common';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { RoomTypeRepository } from './repositories/room-types.repository';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';

@Injectable()
export class RoomTypesService {
  constructor(private readonly roomTypeRepository: RoomTypeRepository) {}

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.create(createRoomTypeDto);
    return roomType;
  }

  async findAll(): Promise<RoomType[]> {
    return this.roomTypeRepository.findAll();
  }

  async findOne(id: string): Promise<RoomType> {
    return this.roomTypeRepository.findById(id);
  }

  async update(
    id: string,
    updateRoomTypeDto: UpdateRoomTypeDto,
  ): Promise<RoomType> {
    return this.roomTypeRepository.update(id, updateRoomTypeDto);
  }

  async remove(id: string): Promise<RoomType> {
    return this.roomTypeRepository.delete(id);
  }
}
