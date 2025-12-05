import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/modules/users/entities/user.entity';
import { Role } from '@app/modules/roles/entities/role.entity';
import { Stake } from '@app/modules/stakes/entities/stake.entity';
import { Company } from '@app/modules/companies/entities/company.entity';
import { UsersSeedService } from './users-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Stake, Company])],
  providers: [UsersSeedService],
  exports: [UsersSeedService],
})
export class UserSeedModule {}
