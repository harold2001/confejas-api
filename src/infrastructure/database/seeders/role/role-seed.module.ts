import { Module } from '@nestjs/common';
// import { RoleSeedService } from './role-seed.service';
// import { RoleModule } from '@modules/role/role.module';
// import { RoleRepository } from '@modules/role/role.repository';

@Module({
  imports: [],
  // imports: [RoleModule],
  providers: [],
  exports: [],
  // providers: [RoleSeedService, RoleRepository],
  // exports: [RoleSeedService, RoleModule],
})
export class RoleSeedModule {}
