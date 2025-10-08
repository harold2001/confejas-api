import { GenericRepository } from '@core/abstracts/generic-repository';
import { TypeOrmRepository } from '@infrastructure/database/typeorm/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Role } from '@app/modules/roles/entities/role.entity';

@Injectable()
export class RoleRepository
  extends TypeOrmRepository<Role>
  implements GenericRepository<Role>
{
  protected relations: string[] = ['users'];
  protected paginatedRelations: string[] = [];

  constructor(
    @InjectRepository(Role) protected readonly repository: Repository<Role>,
  ) {
    super(repository);
  }

  protected parseFilters(filters?: any): FindOptionsWhere<Role> {
    const where: FindOptionsWhere<Role> = {};

    if (filters?.name) {
      where.name = filters.name;
    }

    return where;
  }
}
