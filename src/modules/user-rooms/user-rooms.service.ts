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

  async assignRoom(
    userId: string,
    roomId: string,
  ): Promise<{ message: string }> {
    // 1. Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // 2. Verificar que la habitación existe
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException(`Habitación con ID ${roomId} no encontrada`);
    }

    // 3. Verificar capacidad de la habitación
    const activeUserRooms = await this.userRoomRepository.findAll({
      roomId: roomId,
      isActive: true,
    });

    const occupiedBeds = activeUserRooms.length;
    const totalBeds = room.totalBeds || 0;

    if (occupiedBeds >= totalBeds) {
      throw new NotFoundException(
        `La habitación ${room.roomNumber} no tiene camas disponibles. Ocupadas: ${occupiedBeds}/${totalBeds}`,
      );
    }

    // 4. Desactivar asignaciones previas de este usuario
    const previousUserRooms = await this.userRoomRepository.findAll({
      userId: userId,
      isActive: true,
    });

    for (const userRoom of previousUserRooms) {
      await this.userRoomRepository.update(userRoom.id, { isActive: false });
    }

    // 5. Crear nueva asignación activa
    await this.userRoomRepository.create({
      user,
      room,
      isActive: true,
    });

    return {
      message: 'Habitación actualizada correctamente',
    };
  }
}
