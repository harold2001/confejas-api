import { GenericRepository } from '@core/abstracts/generic-repository';
import { TypeOrmRepository } from '@infrastructure/database/typeorm/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Room } from '@app/modules/rooms/entities/room.entity';

@Injectable()
export class RoomRepository
  extends TypeOrmRepository<Room>
  implements GenericRepository<Room>
{
  protected relations: string[] = [
    'floor',
    'floor.building',
    'roomType',
    'userRooms',
    'userRooms.user',
  ];
  protected paginatedRelations: string[] = [
    'floor',
    'floor.building',
    'roomType',
    'userRooms',
    'userRooms.user',
  ];

  constructor(
    @InjectRepository(Room) protected readonly repository: Repository<Room>,
  ) {
    super(repository);
  }

  protected parseFilters(filters?: any): FindOptionsWhere<Room> {
    const where: FindOptionsWhere<Room> = {};

    if (filters?.roomNumber) {
      where.roomNumber = filters.roomNumber;
    }

    if (filters?.floorId) {
      where.floor = { id: filters.floorId };
    }

    if (filters?.roomTypeId) {
      where.roomType = { id: filters.roomTypeId };
    }

    return where;
  }

  async findAllWithUserCount(): Promise<Array<Room & { userCount: number }>> {
    const rooms = await this.repository
      .createQueryBuilder('room')
      .leftJoin('room.userRooms', 'userRoom', 'userRoom.isActive = :isActive', {
        isActive: true,
      })
      .leftJoinAndSelect('room.floor', 'floor')
      .leftJoinAndSelect('floor.building', 'building')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .select('room.id', 'id')
      .addSelect('room.roomNumber', 'roomNumber')
      .addSelect('room.totalBeds', 'totalBeds')
      .addSelect('room.createdAt', 'createdAt')
      .addSelect('room.updatedAt', 'updatedAt')
      .addSelect('floor.id', 'floor_id')
      .addSelect('floor.number', 'floor_number')
      .addSelect('building.id', 'building_id')
      .addSelect('building.name', 'building_name')
      .addSelect('roomType.id', 'roomType_id')
      .addSelect('roomType.name', 'roomType_name')
      .addSelect('COUNT(userRoom.id)', 'occupiedBeds')
      .groupBy('room.id')
      .addGroupBy('floor.id')
      .addGroupBy('building.id')
      .addGroupBy('roomType.id')
      .orderBy('building.name', 'ASC')
      .addOrderBy('floor.number', 'ASC')
      .addOrderBy('room.roomNumber', 'ASC')
      .getRawMany();

    return rooms.map((room) => {
      const occupiedBeds = parseInt(room.occupiedBeds, 10);
      const totalBeds = room.totalBeds;
      const availableBeds = totalBeds - occupiedBeds;

      return {
        id: room.id,
        roomNumber: room.roomNumber,
        totalBeds: totalBeds,
        occupiedBeds: occupiedBeds,
        availableBeds: availableBeds,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        floor: room.floor_id
          ? {
              id: room.floor_id,
              number: room.floor_number,
              building: room.building_id
                ? {
                    id: room.building_id,
                    name: room.building_name,
                  }
                : null,
            }
          : null,
        roomType: room.roomType_id
          ? {
              id: room.roomType_id,
              name: room.roomType_name,
            }
          : null,
      };
    }) as any;
  }
}
