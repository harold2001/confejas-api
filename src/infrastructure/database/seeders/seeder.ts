import { Injectable, Logger } from '@nestjs/common';
import { RolesSeedService } from './roles/roles-seed.service';
import { BuildingsSeedService } from './buildings/buildings-seed.service';
import { RoomTypesSeedService } from './room-types/room-types-seed.service';
import { FloorsSeedService } from './floors/floors-seed.service';
import { RoomsSeedService } from './rooms/rooms-seed.service';
import { UsersSeedService } from './users/users-seed.service';
import { UserRoomsSeedService } from './user-rooms/user-rooms-seed.service';
import { StakesSeedService } from './stakes/stakes-seed.service';
import { CompaniesSeedService } from './companies/companies-seed.service';

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  constructor(
    private readonly rolesSeedService: RolesSeedService,
    private readonly buildingsSeedService: BuildingsSeedService,
    private readonly roomTypesSeedService: RoomTypesSeedService,
    private readonly floorsSeedService: FloorsSeedService,
    private readonly roomsSeedService: RoomsSeedService,
    private readonly usersSeedService: UsersSeedService,
    private readonly userRoomsSeedService: UserRoomsSeedService,
    private readonly stakesSeedService: StakesSeedService,
    private readonly companiesSeedService: CompaniesSeedService,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('🚀 Starting database seeding process...');

    try {
      // 1. Seed Roles (no dependencies)
      this.logger.log('1️⃣ Seeding roles...');
      await this.rolesSeedService.seed();

      // 2. Seed Buildings (no dependencies)
      this.logger.log('2️⃣ Seeding buildings...');
      await this.buildingsSeedService.seed();

      // 3. Seed Room Types (no dependencies)
      this.logger.log('3️⃣ Seeding room types...');
      await this.roomTypesSeedService.seed();

      // New Step: Seed Stakes (no dependencies)
      this.logger.log('3.1️⃣ Seeding stakes...');
      await this.stakesSeedService.seed();

      // New Step: Seed Companies (no dependencies)
      this.logger.log('3.2️⃣ Seeding companies...');
      await this.companiesSeedService.seed();

      // 4. Seed Floors (depends on buildings)
      this.logger.log('4️⃣ Seeding floors...');
      await this.floorsSeedService.seed();

      // 5. Seed Rooms (depends on floors and room types)
      this.logger.log('5️⃣ Seeding rooms...');
      await this.roomsSeedService.seed();

      // 6. Seed Users (depends on roles)
      this.logger.log('6️⃣ Seeding users...');
      await this.usersSeedService.seed();

      // 7. Seed User-Room relationships (depends on users and rooms)
      // this.logger.log('7️⃣ Seeding user-room assignments...');
      // await this.userRoomsSeedService.seed();

      this.logger.log('✅ All seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Seeding process failed:', error);
      throw error;
    }
  }
}
