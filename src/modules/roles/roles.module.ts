import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from '@app/modules/roles/entities/role.entity';
import { RoleRepository } from './repositories/roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
  exports: [RoleRepository],
})
export class RolesModule {}
