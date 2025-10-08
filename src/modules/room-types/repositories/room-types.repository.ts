import { GenericRepository } from '@core/abstracts/generic-repository';
import { TypeOrmRepository } from '@infrastructure/database/typeorm/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';

@Injectable()
export class RoomTypeRepository
  extends TypeOrmRepository<RoomType>
  implements GenericRepository<RoomType>
{
  protected relations: string[] = ['rooms'];
  protected paginatedRelations: string[] = [];

  constructor(
    @InjectRepository(RoomType)
    protected readonly repository: Repository<RoomType>,
  ) {
    super(repository);
  }

  protected parseFilters(filters?: any): FindOptionsWhere<RoomType> {
    const where: FindOptionsWhere<RoomType> = {};

    if (filters?.name) {
      where.name = filters.name;
    }

    return where;
  }
}
