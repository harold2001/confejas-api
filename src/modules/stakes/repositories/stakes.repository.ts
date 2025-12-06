import { GenericRepository } from '@core/abstracts/generic-repository';
import { TypeOrmRepository } from '@infrastructure/database/typeorm/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Stake } from '../entities/stake.entity';

@Injectable()
export class StakeRepository
  extends TypeOrmRepository<Stake>
  implements GenericRepository<Stake>
{
  protected relations: string[] = [];
  protected paginatedRelations: string[] = [];

  constructor(
    @InjectRepository(Stake) protected readonly repository: Repository<Stake>,
  ) {
    super(repository);
  }

  protected parseFilters(filters?: any): FindOptionsWhere<Stake> {
    const where: FindOptionsWhere<Stake> = {};

    if (filters?.name) {
      where.name = filters.name;
    }

    return where;
  }
}
