import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@app/modules/roles/entities/role.entity';
import { rolesData } from './roles-seed.data';

@Injectable()
export class RolesSeedService {
  private readonly logger = new Logger(RolesSeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed(): Promise<Role[]> {
    const createdRoles: Role[] = [];

    for (const roleData of rolesData) {
      // Check if role already exists
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (existingRole) {
        this.logger.log(`Role '${roleData.name}' already exists, skipping...`);
        createdRoles.push(existingRole);
        continue;
      }

      // Create new role
      const role = this.roleRepository.create(roleData);
      const savedRole = await this.roleRepository.save(role);
      createdRoles.push(savedRole);

      this.logger.log(`✅ Created role: ${savedRole.name}`);
    }

    this.logger.log(`Roles seeding completed. Total: ${createdRoles.length}`);
    return createdRoles;
  }
}
