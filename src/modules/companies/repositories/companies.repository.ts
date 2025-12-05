import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { GenericRepository } from '@app/core/abstracts/generic-repository';
import { TypeOrmRepository } from '@app/infrastructure/database/typeorm/repositories';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyRepository
  extends TypeOrmRepository<Company>
  implements GenericRepository<Company>
{
  protected relations: string[] = ['users'];
  protected paginatedRelations: string[] = ['users'];

  constructor(
    @InjectRepository(Company)
    protected readonly repository: Repository<Company>,
  ) {
    super(repository);
  }

  protected parseFilters(filters?: any): FindOptionsWhere<Company> {
    const where: FindOptionsWhere<Company> = {};
    return where;
  }
}
