import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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
import { CompanyRepository } from '../companies/repositories/companies.repository';
import { MarkAsArrivedDto } from './dto/mark-as-arrived.dto';
import { DataSource } from 'typeorm';
import { UserStatus } from '@app/core/enums/user-status';
import { PermutaUserDto } from './dto/permuta-user.dto';
import { Gender } from '@app/core/enums/gender';
import { AttendanceGateway } from '@app/infrastructure/websocket/websocket.gateway';
import { UserRoomsService } from '../user-rooms/user-rooms.service';
import { RoomRepository } from '../rooms/repositories/rooms.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly stakeRepository: StakeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly emailService: EmailService,
    private readonly qrService: QrService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly attendanceGateway: AttendanceGateway,
    private readonly userRoomsService: UserRoomsService,
    private readonly roomRepository: RoomRepository,
  ) {}

  async sendQr(userIds: string[]) {
    // Get users by IDs
    const usersToSend = await this.userRepository.findByIds(userIds);

    // Filter out null users and those who already have QR sent
    // const usersToSend = allUsers.filter(
    //   (user) => user && user.email && user.email.trim() !== '' && !user.qrSent,
    // );

    if (usersToSend.length === 0) {
      return {
        success: true,
        message:
          'No hay usuarios pendientes para enviar QR (todos ya tienen QR enviado o no tienen email)',
        totalUsers: 0,
        successCount: 0,
        failedCount: 0,
        failed: [],
        skipped: userIds.length,
      };
    }

    const webAppUrl = this.configService.get<string>('web.url');
    const batchSize = 100;
    const delayBetweenBatches = 1000; // 1 second

    let successCount = 0;
    let failedCount = 0;
    const failedUsers: Array<{ email: string; error: string }> = [];

    // Process in batches of 100
    for (let i = 0; i < usersToSend.length; i += batchSize) {
      const batch = usersToSend.slice(i, i + batchSize);

      // Send emails in current batch
      await Promise.all(
        batch.map(async (user) => {
          try {
            // Generate attendance token
            const token = this.generateAttendanceToken(user.id);
            const qrUrl = `${webAppUrl}/attendance/verify/${token}`;

            // Generate QR code from URL
            const { qrBase64 } = await this.qrService.generateQrFromUrl(qrUrl);

            // Send email
            await this.emailService.sendQrEmail(user.email, qrBase64);

            // Mark QR as sent
            await this.userRepository.update(user.id, { qrSent: true });

            successCount++;
          } catch (error) {
            failedCount++;
            failedUsers.push({
              email: user.email,
              error: error.message || 'Error desconocido',
            });
          }
        }),
      );

      // Delay between batches (except for the last batch)
      if (i + batchSize < usersToSend.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenBatches),
        );
      }
    }

    const skippedCount = userIds.length - usersToSend.length;

    return {
      success: true,
      message: `Proceso de envío completado. ${successCount} correos enviados exitosamente, ${failedCount} fallidos, ${skippedCount} omitidos (ya tenían QR enviado).`,
      totalUsers: usersToSend.length,
      successCount,
      failedCount,
      skipped: skippedCount,
      failed: failedUsers,
    };
  }

  async markAsArrived(
    id: string,
    markAsArrivedDto: MarkAsArrivedDto,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.hasArrived = markAsArrivedDto.hasArrived;
    const updatedUser = await this.userRepository.update(id, user);

    // Emit socket event
    this.attendanceGateway.emitAttendanceUpdate(updatedUser);

    return updatedUser;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleIds, password, companyId, roomId, ...userData } = createUserDto;

    const stakeId =
      userData.stakeId && userData.stakeId.trim() !== ''
        ? userData.stakeId
        : undefined;

    const roles = await Promise.all(
      roleIds.map(async (roleId) => {
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
          throw new NotFoundException(`Role with ID ${roleId} not found`);
        }
        return role;
      }),
    );

    let stake = undefined;
    if (stakeId) {
      stake = await this.stakeRepository.findById(stakeId);
      if (!stake) {
        throw new NotFoundException(`Stake with ID ${stakeId} not found`);
      }
    }

    let company = undefined;
    if (companyId && companyId.trim() !== '') {
      company = await this.companyRepository.findById(companyId);
      if (!company) {
        throw new NotFoundException(`Company with ID ${companyId} not found`);
      }
    }

    let room = undefined;
    if (roomId && roomId.trim() !== '') {
      room = await this.roomRepository.findById(roomId);
      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} not found`);
      }
    }

    const user = await this.userRepository.create({
      ...userData,
      password: password,
      roles,
      stake,
      company,
    });

    if (room) {
      await this.userRoomsService.assignRoom(user.id, room.id);
    }

    return user;
  }

  private generateAttendanceToken(userId: string): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('app.jwtSecret'),
        expiresIn: '7d', // 1 week
      },
    );
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

  async getAttendanceToken(
    userId: string,
  ): Promise<{ token: string; qrUrl: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const token = this.generateAttendanceToken(userId);
    const frontendUrl =
      this.configService.get<string>('app.frontendUrl') ||
      'http://localhost:8100';
    const qrUrl = `${frontendUrl}/attendance/verify/${token}`;

    return { token, qrUrl };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { roleIds, password, companyId, ...userData } = updateUserDto;

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

    // Validate and fetch stake if stakeId is provided and not empty
    if (userData.stakeId && userData.stakeId.trim() !== '') {
      const stake = await this.stakeRepository.findById(userData.stakeId);

      if (!stake) {
        throw new NotFoundException(
          `Stake with ID ${userData.stakeId} not found`,
        );
      }

      updateData.stake = stake;
    }

    // Validate and fetch company if companyId is provided and not empty
    if (companyId && companyId.trim() !== '') {
      const company = await this.companyRepository.findById(companyId);
      if (!company) {
        throw new NotFoundException(`Company with ID ${companyId} not found`);
      }
      updateData.company = company;
    }

    return this.userRepository.update(id, updateData);
  }

  async remove(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }

  async permutaUser(permutaUserDto: PermutaUserDto): Promise<User> {
    const { originalUserId, roleIds, password, stakeId, ...newUserData } =
      permutaUserDto;

    const originalUser = await this.userRepository.findById(originalUserId);

    if (!originalUser) {
      throw new NotFoundException(
        `Usuario original con ID ${originalUserId} no encontrado`,
      );
    }

    if (originalUser.replacedBy) {
      throw new BadRequestException(
        `El usuario ${originalUser.firstName} ${originalUser.paternalLastName} ya fue reemplazado anteriormente`,
      );
    }

    const createUserDto = {
      ...newUserData,
      password,
      roleIds,
      stakeId,
      hasArrived: false,
    };

    const savedNewUser = await this.create(createUserDto);

    originalUser.hasArrived = false;
    originalUser.status = UserStatus.REPLACED;
    originalUser.replacedBy = savedNewUser;

    await this.userRepository.update(originalUser.id, originalUser);

    return savedNewUser;
  }

  async verifyAttendance(token: string) {
    try {
      // Verify JWT token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('app.jwtSecret'),
      });

      // Get user by ID from token
      const user = await this.userRepository.findById(payload.userId);

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Mark attendance as true (always true, can be scanned multiple times)
      user.hasArrived = true;
      const updatedUser = await this.userRepository.update(user.id, user);

      // Emit socket event
      this.attendanceGateway.emitAttendanceUpdate(updatedUser);

      // Return user information
      return {
        success: true,
        message: 'Asistencia confirmada exitosamente',
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          middleName: updatedUser.middleName,
          paternalLastName: updatedUser.paternalLastName,
          maternalLastName: updatedUser.maternalLastName,
          company: updatedUser.company,
          userRooms: updatedUser.userRooms,
          hasArrived: updatedUser.hasArrived,
        },
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El código QR ha expirado');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Código QR inválido');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error al verificar la asistencia. Por favor, intente nuevamente.',
      );
    }
  }

  async getStatistics() {
    // Get all users with relations
    const allUsers = await this.userRepository.findAll();

    // Filter only users with "Participante" role
    const users = allUsers.filter((user) =>
      user.roles?.some((role) => role.name === 'Participant'),
    );

    // Total users
    const totalUsers = users.length;

    // Arrival statistics
    const usersArrived = users.filter((u) => u.hasArrived).length;
    const usersNotArrived = totalUsers - usersArrived;

    // Gender statistics
    const maleCount = users.filter((u) => u.gender === Gender.MALE).length;
    const femaleCount = users.filter((u) => u.gender === Gender.FEMALE).length;

    // Church membership
    const churchMembersCount = users.filter(
      (u) => u.isMemberOfTheChurch === true,
    ).length;
    const nonChurchMembersCount = totalUsers - churchMembersCount;

    // User status
    const activeUsers = users.filter(
      (u) => !u.status || u.status !== UserStatus.REPLACED,
    ).length;
    const replacedUsers = users.filter(
      (u) => u.status === UserStatus.REPLACED,
    ).length;

    // Medical statistics
    const usersWithMedicalCondition = users.filter((u) => {
      if (!u.medicalCondition || u.medicalCondition.trim() === '') return false;
      const condition = u.medicalCondition.toLowerCase().trim();
      // Exclude common "no" responses
      if (
        condition.includes('no') ||
        condition.includes('ninguna') ||
        condition.includes('ningúna') ||
        condition === '-' ||
        condition === '--' ||
        condition.includes('no tiene') ||
        condition.includes('no tengo')
      ) {
        return false;
      }
      return true;
    }).length;

    const usersWithMedicalTreatment = users.filter((u) => {
      if (!u.medicalTreatment || u.medicalTreatment.trim() === '') return false;
      const treatment = u.medicalTreatment.toLowerCase().trim();
      // Exclude common "no" responses
      if (
        treatment.includes('no') ||
        treatment.includes('ninguna') ||
        treatment.includes('ningúna') ||
        treatment === '-' ||
        treatment === '--' ||
        treatment === 'mot' ||
        treatment.includes('no tiene') ||
        treatment.includes('no tengo')
      ) {
        return false;
      }
      return true;
    }).length;

    // Blood type statistics
    const bloodTypeMap = new Map<string, number>();
    users.forEach((u) => {
      if (u.bloodType && u.bloodType.trim() !== '') {
        const type = u.bloodType.trim();
        bloodTypeMap.set(type, (bloodTypeMap.get(type) || 0) + 1);
      }
    });
    const bloodTypeStatistics = Array.from(bloodTypeMap.entries()).map(
      ([type, count]) => ({ type, count }),
    );

    // Shirt size statistics
    const shirtSizeMap = new Map<string, number>();
    users.forEach((u) => {
      if (u.shirtSize && u.shirtSize.trim() !== '') {
        const size = u.shirtSize.trim();
        shirtSizeMap.set(size, (shirtSizeMap.get(size) || 0) + 1);
      }
    });
    const shirtSizeStatistics = Array.from(shirtSizeMap.entries()).map(
      ([size, count]) => ({ size, count }),
    );

    // Age range statistics (18-35 years, ranges of ~3 years)
    const ageRanges = [
      { range: '18-20', min: 18, max: 20 },
      { range: '21-23', min: 21, max: 23 },
      { range: '24-26', min: 24, max: 26 },
      { range: '27-29', min: 27, max: 29 },
      { range: '30-32', min: 30, max: 32 },
      { range: '33-35', min: 33, max: 35 },
    ];

    const ageRangeStatistics = ageRanges.map((range) => {
      const count = users.filter((u) => {
        if (!u.age) return false;
        const age = parseInt(u.age);
        return age >= range.min && age <= range.max;
      }).length;
      return { range: range.range, count };
    });

    // Average age
    const usersWithAge = users.filter((u) => u.age && !isNaN(parseInt(u.age)));
    const averageAge =
      usersWithAge.length > 0
        ? usersWithAge.reduce((sum, u) => sum + parseInt(u.age), 0) /
          usersWithAge.length
        : 0;

    // Company statistics
    const companyMap = new Map<string, any>();
    users.forEach((u) => {
      if (u.company) {
        if (!companyMap.has(u.company.id)) {
          companyMap.set(u.company.id, {
            companyId: u.company.id,
            companyName: u.company.name,
            userCount: 0,
            users: [],
          });
        }
        const companyData = companyMap.get(u.company.id);
        companyData.userCount++;
        companyData.users.push({
          id: u.id,
          firstName: u.firstName,
          paternalLastName: u.paternalLastName,
          maternalLastName: u.maternalLastName,
        });
      }
    });
    const companyStatistics = Array.from(companyMap.values());

    // Stake statistics
    const stakeMap = new Map<string, any>();
    users.forEach((u) => {
      if (u.stake) {
        if (!stakeMap.has(u.stake.id)) {
          stakeMap.set(u.stake.id, {
            stakeId: u.stake.id,
            stakeName: u.stake.name,
            userCount: 0,
            churchMembersCount: 0,
            maleCount: 0,
            femaleCount: 0,
            arrivedCount: 0,
          });
        }
        const stakeData = stakeMap.get(u.stake.id);
        stakeData.userCount++;
        if (u.isMemberOfTheChurch) stakeData.churchMembersCount++;
        if (u.gender === Gender.MALE) stakeData.maleCount++;
        if (u.gender === Gender.FEMALE) stakeData.femaleCount++;
        if (u.hasArrived) stakeData.arrivedCount++;
      }
    });
    const stakeStatistics = Array.from(stakeMap.values());

    return {
      totalUsers,
      usersArrived,
      usersNotArrived,
      maleCount,
      femaleCount,
      churchMembersCount,
      nonChurchMembersCount,
      activeUsers,
      replacedUsers,
      usersWithMedicalCondition,
      usersWithMedicalTreatment,
      bloodTypeStatistics,
      shirtSizeStatistics,
      ageRangeStatistics,
      averageAge: Math.round(averageAge * 10) / 10, // Round to 1 decimal
      companyStatistics,
      stakeStatistics,
    };
  }

  async assignRoom(
    userId: string,
    roomId: string,
  ): Promise<{ message: string }> {
    return this.userRoomsService.assignRoom(userId, roomId);
  }

  async getUsersForRoomAssignment() {
    const users = await this.userRepository.findAll();

    return users.map((user) => {
      const activeRoom = user.userRooms?.find((ur) => ur.isActive);
      const fullName =
        `${user.firstName} ${user.paternalLastName}${user.maternalLastName ? ' ' + user.maternalLastName : ''}`.trim();

      return {
        id: user.id,
        firstName: user.firstName,
        paternalLastName: user.paternalLastName,
        maternalLastName: user.maternalLastName,
        fullName,
        email: user.email,
        hasRoom: !!activeRoom,
        currentRoom: activeRoom
          ? {
              id: activeRoom.room.id,
              roomNumber: activeRoom.room.roomNumber,
              floorNumber: activeRoom.room.floor?.number,
              buildingName: activeRoom.room.floor?.building?.name,
            }
          : null,
        isParticipant: user.roles?.some((role) => role.name === 'Participant'),
        isStaff: user.roles?.some((role) => role.name === 'Staff'),
      };
    });
  }
}
