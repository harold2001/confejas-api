import { GenericRepository } from '@core/abstracts/generic-repository';
import { TypeOrmRepository } from '@infrastructure/database/typeorm/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';

@Injectable()
export class UserRoomRepository
  extends TypeOrmRepository<UserRoom>
  implements GenericRepository<UserRoom>
{
  protected relations: string[] = ['user', 'room'];
  protected paginatedRelations: string[] = ['user', 'room'];

  constructor(
    @InjectRepository(UserRoom)
    protected readonly repository: Repository<UserRoom>,
  ) {
    super(repository);
  }

  protected parseFilters(filters?: any): FindOptionsWhere<UserRoom> {
    const where: FindOptionsWhere<UserRoom> = {};

    if (filters?.userId) {
      where.user = { id: filters.userId };
    }

    if (filters?.roomId) {
      where.room = { id: filters.roomId };
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return where;
  }
}
