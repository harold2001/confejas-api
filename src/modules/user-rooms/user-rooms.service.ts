import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRoomDto } from './dto/create-user-room.dto';
import { UpdateUserRoomDto } from './dto/update-user-room.dto';
import { UserRoomRepository } from './repositories/user-rooms.repository';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';
import { RoomRepository } from '@app/modules/rooms/repositories/rooms.repository';
import { UserRepository } from '../users/repositories/users.repository';

@Injectable()
export class UserRoomsService {
  constructor(
    private readonly userRoomRepository: UserRoomRepository,
    private readonly userRepository: UserRepository,
    private readonly roomRepository: RoomRepository,
  ) {}

  async create(createUserRoomDto: CreateUserRoomDto): Promise<UserRoom> {
    const { userId, roomId } = createUserRoomDto;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const userRoom = await this.userRoomRepository.create({
      user,
      room,
    });
    return userRoom;
  }

  async findAll(): Promise<UserRoom[]> {
    return this.userRoomRepository.findAll();
  }

  async findOne(id: string): Promise<UserRoom> {
    return this.userRoomRepository.findById(id);
  }

  async update(
    id: string,
    updateUserRoomDto: UpdateUserRoomDto,
  ): Promise<UserRoom> {
    const { userId, roomId } = updateUserRoomDto;

    const updateData: any = {};

    if (userId) {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      updateData.user = user;
    }

    if (roomId) {
      const room = await this.roomRepository.findById(roomId);
      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} not found`);
      }
      updateData.room = room;
    }

    return this.userRoomRepository.update(id, updateData);
  }

  async remove(id: string): Promise<UserRoom> {
    return this.userRoomRepository.delete(id);
  }
}
