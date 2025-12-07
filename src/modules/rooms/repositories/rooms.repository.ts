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
}
