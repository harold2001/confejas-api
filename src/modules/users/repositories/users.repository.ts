import { GenericRepository } from '@core/abstracts/generic-repository';
import { TypeOrmRepository } from '@infrastructure/database/typeorm/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository, ILike } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '@app/modules/users/entities/user.entity';
import { FilterUserDto } from '../dto/filter-user.dto';

@Injectable()
export class UserRepository
  extends TypeOrmRepository<User>
  implements GenericRepository<User>
{
  protected relations: string[] = ['roles', 'userRooms', 'stake'];
  protected paginatedRelations: string[] = ['roles', 'stake'];

  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  protected parseFilters(
    filters?: FilterUserDto,
  ): FindOptionsWhere<User> | FindOptionsWhere<User>[] {
    const where: FindOptionsWhere<User> = {};

    if (filters?.email) {
      where.email = filters.email;
    }

    if (filters?.firstName) {
      where.firstName = filters.firstName;
    }

    if (filters?.paternalLastName) {
      where.paternalLastName = filters.paternalLastName;
    }

    if (filters?.maternalLastName) {
      where.maternalLastName = filters.maternalLastName;
    }

    if (filters?.dni) {
      where.dni = filters.dni;
    }

    if (filters?.phone) {
      where.phone = filters.phone;
    }

    // Filter by role name (relation)
    if (filters?.roleNames?.length) {
      where.roles = {
        name: In(filters.roleNames),
      };
    }

    if (filters?.searchName) {
      const searchPattern = `%${filters.searchName}%`;

      return [
        { ...where, firstName: ILike(searchPattern) },
        { ...where, middleName: ILike(searchPattern) },
        { ...where, paternalLastName: ILike(searchPattern) },
        { ...where, maternalLastName: ILike(searchPattern) },
      ];
    }

    return where;
  }
}
