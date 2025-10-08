import { GenericRepository } from '@core/abstracts/generic-repository';
import { TypeOrmRepository } from '@infrastructure/database/typeorm/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Floor } from '@app/modules/floors/entities/floor.entity';

@Injectable()
export class FloorRepository
  extends TypeOrmRepository<Floor>
  implements GenericRepository<Floor>
{
  protected relations: string[] = ['building', 'rooms'];
  protected paginatedRelations: string[] = ['building'];

  constructor(
    @InjectRepository(Floor) protected readonly repository: Repository<Floor>,
  ) {
    super(repository);
  }

  protected parseFilters(filters?: any): FindOptionsWhere<Floor> {
    const where: FindOptionsWhere<Floor> = {};

    if (filters?.number) {
      where.number = filters.number;
    }

    if (filters?.buildingId) {
      where.building = { id: filters.buildingId };
    }

    return where;
  }
}
