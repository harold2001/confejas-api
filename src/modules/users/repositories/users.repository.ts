import { GenericRepository } from '@core/abstracts/generic-repository';
import { TypeOrmRepository } from '@infrastructure/database/typeorm/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  In,
  Repository,
  ILike,
  Not,
  IsNull,
  And,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '@app/modules/users/entities/user.entity';
import { FilterUserDto } from '../dto/filter-user.dto';

@Injectable()
export class UserRepository
  extends TypeOrmRepository<User>
  implements GenericRepository<User>
{
  protected relations: string[] = [
    'roles',
    'stake',
    'company',
    'userRooms',
    'userRooms.room',
    'userRooms.room.floor',
    'userRooms.room.floor.building',
    'replacedBy',
  ];
  protected paginatedRelations: string[] = [
    'roles',
    'stake',
    'company',
    'userRooms',
    'userRooms.room',
    'userRooms.room.floor',
    'userRooms.room.floor.building',
    'replacedBy',
  ];

  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  async insertMany(users: User[]): Promise<void> {
    await this.repository.insert(users);
  }

  protected parseFilters(
    filters?: FilterUserDto,
  ): FindOptionsWhere<User> | FindOptionsWhere<User>[] {
    const where: FindOptionsWhere<User> = {};

    if (filters?.email) {
      where.email = filters.email;
    }

    if (filters?.firstName) {
      where.firstName = ILike(`%${filters.firstName}%`);
    }

    if (filters?.middleName) {
      where.middleName = ILike(`%${filters.middleName}%`);
    }

    if (filters?.paternalLastName) {
      where.paternalLastName = ILike(`%${filters.paternalLastName}%`);
    }

    if (filters?.maternalLastName) {
      where.maternalLastName = ILike(`%${filters.maternalLastName}%`);
    }

    if (filters?.dni) {
      where.dni = ILike(`%${filters.dni}%`);
    }

    if (filters?.phone) {
      where.phone = ILike(`%${filters.phone}%`);
    }

    if (filters?.address) {
      where.address = ILike(`%${filters.address}%`);
    }

    if (filters?.department) {
      where.department = ILike(`%${filters.department}%`);
    }

    if (filters?.hasArrived !== undefined) {
      where.hasArrived = filters.hasArrived;
    }

    if (filters?.medicalCondition) {
      where.medicalCondition = ILike(`%${filters.medicalCondition}%`);
    }

    if (filters?.medicalTreatment) {
      where.medicalTreatment = ILike(`%${filters.medicalTreatment}%`);
    }

    if (filters?.hasMedicalCondition !== undefined) {
      if (filters.hasMedicalCondition) {
        where.medicalCondition = And(
          Not(ILike('%no%')),
          Not(ILike('%ninguna%')),
          Not(ILike('%ningúna%')),
          Not('-'),
          Not('--'),
        );
      }
    }

    if (filters?.hasMedicalTreatment !== undefined) {
      if (filters.hasMedicalTreatment) {
        where.medicalTreatment = And(
          Not(ILike('%no%')),
          Not(ILike('%ninguna%')),
          Not(ILike('%ningúna%')),
          Not('-'),
          Not('--'),
          Not('mot'),
        );
      }
    }

    if (filters?.keyCode) {
      where.keyCode = ILike(`%${filters.keyCode}%`);
    }

    if (filters?.ward) {
      where.ward = ILike(`%${filters.ward}%`);
    }

    if (filters?.stakeId) {
      where.stake = { id: filters.stakeId };
    }

    if (filters?.stakeIds?.length) {
      where.stake = { id: In(filters.stakeIds) };
    }

    if (filters?.stakeName) {
      where.stake = { name: ILike(`%${filters.stakeName}%`) };
    }

    if (filters?.age) {
      where.age = filters.age;
    }

    if (filters?.isMemberOfTheChurch !== undefined) {
      where.isMemberOfTheChurch = filters.isMemberOfTheChurch;
    }

    if (filters?.notes) {
      where.notes = ILike(`%${filters.notes}%`);
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.shirtSize) {
      where.shirtSize = ILike(`%${filters.shirtSize}%`);
    }

    if (filters?.bloodType) {
      where.bloodType = ILike(`%${filters.bloodType}%`);
    }

    if (filters?.healthInsurance) {
      where.healthInsurance = ILike(`%${filters.healthInsurance}%`);
    }

    if (filters?.emergencyContactName) {
      where.emergencyContactName = ILike(`%${filters.emergencyContactName}%`);
    }

    if (filters?.emergencyContactPhone) {
      where.emergencyContactPhone = filters.emergencyContactPhone;
    }

    if (filters?.gender) {
      where.gender = filters.gender;
    }

    if (filters?.birthDate) {
      where.birthDate = filters.birthDate;
    }

    // Filter by role name (relation)
    if (filters?.roleNames?.length) {
      where.roles = {
        name: In(filters.roleNames),
      };
    }

    // Filter by email existence
    if (filters?.hasEmail !== undefined) {
      if (filters.hasEmail) {
        where.email = Not(IsNull());
      } else {
        where.email = IsNull();
      }
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
