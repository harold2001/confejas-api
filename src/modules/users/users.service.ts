import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@app/modules/users/entities/user.entity';
import { RoleRepository } from '@app/modules/roles/repositories/roles.repository';
import { UserRepository } from './repositories/users.repository';
import { EmailService } from '@app/infrastructure/email/email.service';
import { QrService } from '@app/infrastructure/qr/qr.service';
import { PaginationDto } from '@app/core/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { StakeRepository } from '../stakes/repositories/stakes.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly stakeRepository: StakeRepository,
    private readonly emailService: EmailService,
    private readonly qrService: QrService,
  ) {}

  // TODO: Traer todos los usuarios y enviarles el QR por email
  async sendQr() {
    const { qrBase64 } = await this.qrService.generateUserQr(
      'da0742fc-1c05-49ff-a14f-ed87c785ea2d',
    );

    await this.emailService.sendQrEmail('hcarazasnires@gmail.com', qrBase64);

    return { message: 'QR email sent' };
  }

  async markAsArrived(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.hasArrived = !user.hasArrived;
    return this.userRepository.update(id, user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleIds, password, ...userData } = createUserDto;

    // Fetch all roles
    const roles = await Promise.all(
      roleIds.map(async (roleId) => {
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
          throw new NotFoundException(`Role with ID ${roleId} not found`);
        }
        return role;
      }),
    );

    const stake = await this.stakeRepository.findById(userData.stakeId);

    if (!stake) {
      throw new NotFoundException(
        `Stake with ID ${userData.stakeId} not found`,
      );
    }

    const user = await this.userRepository.create({
      ...userData,
      password: password,
      roles,
      stake,
    });
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findAllPaginated(
    pagination: PaginationDto,
    filters: FilterUserDto,
  ): Promise<{ count: number; data: User[] }> {
    return this.userRepository.findAllPaginated(pagination, filters);
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { roleIds, password, ...userData } = updateUserDto;

    const updateData: any = { ...userData };

    // If roleIds are provided, fetch and update roles
    if (roleIds && roleIds.length > 0) {
      const roles = await Promise.all(
        roleIds.map(async (roleId) => {
          const role = await this.roleRepository.findById(roleId);
          if (!role) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
          }
          return role;
        }),
      );
      updateData.roles = roles;
    }

    return this.userRepository.update(id, updateData);
  }

  async remove(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }
}
