import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/modules/users/entities/user.entity';
import { Role } from '@app/modules/roles/entities/role.entity';
import { Stake } from '@app/modules/stakes/entities/stake.entity';
import { Company } from '@app/modules/companies/entities/company.entity';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';
import { UsersSeedService } from './users-seed.service';
import { UsersModule } from '@app/modules/users/users.module';
import { RolesModule } from '@app/modules/roles/roles.module';
import { StakesModule } from '@app/modules/stakes/stakes.module';
import { CompaniesModule } from '@app/modules/companies/companies.module';
import { RoomsModule } from '@app/modules/rooms/rooms.module';
import { UserRoomsModule } from '@app/modules/user-rooms/user-rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Stake, Company, Room, UserRoom]),
    UsersModule,
    RolesModule,
    StakesModule,
    CompaniesModule,
    RoomsModule,
    UserRoomsModule,
  ],
  providers: [UsersSeedService],
  exports: [UsersSeedService],
})
export class UserSeedModule {}
