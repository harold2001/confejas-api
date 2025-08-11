import { Injectable, Logger } from '@nestjs/common';
// import { UserSeedService } from './user/user-seed.service';
// import { RoleSeedService } from '@infrastructure/database/seeders/role/role-seed.service';
// import { Role } from '@modules/role/entities/role.entity';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    // private readonly userSeeder: UserSeedService,
    // private readonly roleSeeder: RoleSeedService,
    // private readonly documentTypeSeedService: DocumentTypeSeedService,
    // private readonly dispatchTypeSeedService: DispatchTypeSeedService,
    // private readonly dispatchTypeRepository: DispatchTypeRepository,
  ) {}

  async seed() {
    // try {
    //   this.logger.log('Running seed...');
    //   const roles = await this.roles();
    //   await this.dispatchTypes();
    //   await this.documentTypes();
    //   await this.users(roles);
    // } catch (err) {
    //   this.logger.error(err);
    // }
  }

  // private async users(roles: Role[]) {
  // try {
  //   this.logger.log('Seeding users...');
  //   const users = await Promise.all(this.userSeeder.create(roles));
  //   this.logger.log(`${users.length} users created`);
  //   return users;
  // } catch (error) {
  //   this.logger.error('Error while seeding users', error);
  // }
  // }

  private async roles() {
    // try {
    //   this.logger.log('Seeding roles...');
    //   const roles = await Promise.all(this.roleSeeder.create());
    //   this.logger.log(`${roles.length} roles created`);
    //   return roles;
    // } catch (error) {
    //   this.logger.error('Error while seeding roles', error);
    // }
  }
}
