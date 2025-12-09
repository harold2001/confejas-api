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
  protected relations: string[] = [
    'users',
    'users.stake',
    'users.userRooms',
    'users.userRooms.room',
  ];
  protected paginatedRelations: string[] = [
    'users',
    'users.stake',
    'users.userRooms',
    'users.userRooms.room',
  ];

  constructor(
    @InjectRepository(Company)
    protected readonly repository: Repository<Company>,
  ) {
    super(repository);
  }

  protected parseFilters(filters?: any): FindOptionsWhere<Company> {
    const where: FindOptionsWhere<Company> = {};

    if (filters?.number !== undefined) {
      where.number = filters.number;
    }

    return where;
  }

  async findAllWithUserCount(): Promise<
    Array<Company & { userCount: number }>
  > {
    const companies = await this.repository
      .createQueryBuilder('company')
      .leftJoin('company.users', 'user')
      .select('company.id', 'id')
      .addSelect('company.name', 'name')
      .addSelect('company.number', 'number')
      .addSelect('company.description', 'description')
      .addSelect('company.createdAt', 'createdAt')
      .addSelect('company.updatedAt', 'updatedAt')
      .addSelect('COUNT(user.id)', 'userCount')
      .groupBy('company.id')
      .orderBy('company.number', 'ASC')
      .getRawMany();

    return companies.map((company) => ({
      ...company,
      userCount: parseInt(company.userCount, 10),
    }));
  }
}
