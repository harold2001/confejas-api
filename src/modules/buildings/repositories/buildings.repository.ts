import { GenericRepository } from '@core/abstracts/generic-repository';
import { TypeOrmRepository } from '@infrastructure/database/typeorm/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Building } from '@app/modules/buildings/entities/building.entity';

@Injectable()
export class BuildingRepository
  extends TypeOrmRepository<Building>
  implements GenericRepository<Building>
{
  protected relations: string[] = ['floors'];
  protected paginatedRelations: string[] = [];

  constructor(
    @InjectRepository(Building)
    protected readonly repository: Repository<Building>,
  ) {
    super(repository);
  }

  protected parseFilters(filters?: any): FindOptionsWhere<Building> {
    const where: FindOptionsWhere<Building> = {};

    if (filters?.name) {
      where.name = filters.name;
    }

    return where;
  }
}
