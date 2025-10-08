import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './repositories/roles.repository';
import { Role } from '@app/modules/roles/entities/role.entity';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.create(createRoleDto);
    return role;
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async findOne(id: string): Promise<Role> {
    return this.roleRepository.findById(id);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: string): Promise<Role> {
    return this.roleRepository.delete(id);
  }
}
