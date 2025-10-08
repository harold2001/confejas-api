import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';
import { User } from '@app/modules/users/entities/user.entity';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { userRoomAssignments } from './user-rooms-seed.data';

@Injectable()
export class UserRoomsSeedService {
  private readonly logger = new Logger(UserRoomsSeedService.name);

  constructor(
    @InjectRepository(UserRoom)
    private readonly userRoomRepository: Repository<UserRoom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async seed(): Promise<UserRoom[]> {
    const createdUserRooms: UserRoom[] = [];

    for (const assignment of userRoomAssignments) {
      // Find the user by DNI
      const user = await this.userRepository.findOne({
        where: { dni: assignment.userDni },
      });

      if (!user) {
        this.logger.warn(
          `User with DNI ${assignment.userDni} not found, skipping assignment to room ${assignment.roomNumber}`,
        );
        continue;
      }

      // Find the room by room number
      const room = await this.roomRepository.findOne({
        where: { roomNumber: assignment.roomNumber },
        relations: ['roomType'],
      });

      if (!room) {
        this.logger.warn(
          `Room ${assignment.roomNumber} not found, skipping assignment for user ${user.firstName} ${user.paternalLastName}`,
        );
        continue;
      }

      // Check if assignment already exists
      const existingAssignment = await this.userRoomRepository.findOne({
        where: {
          user: { id: user.id },
          room: { id: room.id },
        },
      });

      if (existingAssignment) {
        this.logger.log(
          `User ${user.firstName} ${user.paternalLastName} is already assigned to room ${room.roomNumber}, skipping...`,
        );
        createdUserRooms.push(existingAssignment);
        continue;
      }

      // Check room capacity
      const currentAssignments = await this.userRoomRepository.count({
        where: { room: { id: room.id } },
      });

      if (currentAssignments >= room.totalBeds) {
        this.logger.warn(
          `Room ${room.roomNumber} is at capacity (${room.totalBeds} beds), skipping assignment for user ${user.firstName} ${user.paternalLastName}`,
        );
        continue;
      }

      // Create new user-room assignment
      const userRoom = this.userRoomRepository.create({
        user: user,
        room: room,
      });

      const savedUserRoom = await this.userRoomRepository.save(userRoom);
      createdUserRooms.push(savedUserRoom);

      this.logger.log(
        `✅ Assigned ${user.firstName} ${user.paternalLastName} to room ${room.roomNumber} (${room.roomType.name})`,
      );
    }

    this.logger.log(
      `User-Room assignments seeding completed. Total: ${createdUserRooms.length}`,
    );
    return createdUserRooms;
  }
}
