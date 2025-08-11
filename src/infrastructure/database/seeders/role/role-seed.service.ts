import { Injectable } from '@nestjs/common';
// import { roles } from '@infrastructure/database/seeders/role/role-seed';
// import { Role } from '@modules/role/entities/role.entity';
// import { RoleRepository } from '@modules/role/role.repository';

@Injectable()
export class RoleSeedService {
  // constructor(private readonly repository: RoleRepository) {}

  create() {
    // return roles.map(async (role) => {
    //   const exists = await this.repository.findOne({ name: role.name });
    //   if (exists) {
    //     return exists;
    //   }
    //   const newRole = new Role();
    //   newRole.name = role.name;
    //   return await this.repository.create(newRole);
    // });
  }
}
