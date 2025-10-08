import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/modules/users/entities/user.entity';
import { Role } from '@app/modules/roles/entities/role.entity';
import { Stake } from '@app/modules/stakes/entities/stake.entity';
import { usersData } from './users-seed.data';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';

@Injectable()
export class UsersSeedService {
  private readonly logger = new Logger(UsersSeedService.name);
  private readonly DEFAULT_PASSWORD = 'password'; // Default password for seeded users

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Stake)
    private readonly stakeRepository: Repository<Stake>,
  ) {}

  async seed(): Promise<User[]> {
    const createdUsers: User[] = [];

    // Step 1: Seed admin and staff users from usersData
    this.logger.log('Seeding admin and staff users...');
    for (const userData of usersData) {
      const user = await this.createUser(userData);
      if (user) {
        createdUsers.push(user);
      }
    }

    // Step 2: Import participants from CSV
    this.logger.log('Importing participants from CSV...');
    const csvUsers = await this.importFromCSV();
    createdUsers.push(...csvUsers);

    this.logger.log(`Users seeding completed. Total: ${createdUsers.length}`);
    this.logger.log(
      `⚠️  All seeded users have the default password: "${this.DEFAULT_PASSWORD}"`,
    );
    return createdUsers;
  }

  private async createUser(userData: any): Promise<User | null> {
    // Find the role for this user
    const role = await this.roleRepository.findOne({
      where: { name: userData.roleName },
    });

    if (!role) {
      this.logger.warn(
        `Role '${userData.roleName}' not found, skipping user ${userData.firstName} ${userData.paternalLastName}`,
      );
      return null;
    }

    // Find stake if provided
    let stake = null;
    if (userData.stakeName) {
      stake = await this.stakeRepository.findOne({
        where: { name: userData.stakeName },
      });

      if (!stake) {
        this.logger.warn(
          `Stake '${userData.stakeName}' not found for user ${userData.firstName} ${userData.paternalLastName}`,
        );
      }
    }

    // Check if user already exists by email (if provided)
    if (userData.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        this.logger.log(
          `User with email ${userData.email} already exists, skipping...`,
        );
        return existingUser;
      }
    }

    // Create new user
    const user = this.userRepository.create({
      firstName: userData.firstName,
      paternalLastName: userData.paternalLastName,
      maternalLastName: userData.maternalLastName,
      dni: userData.dni,
      birthDate: userData.birthDate,
      gender: userData.gender,
      phone: userData.phone,
      email: userData.email,
      password: this.DEFAULT_PASSWORD,
      address: userData.address,
      region: userData.region,
      department: userData.department,
      medicalCondition: userData.medicalCondition,
      keyCode: userData.keyCode,
      ward: userData.ward,
      age: userData.age,
      isMemberOfTheChurch: userData.isMemberOfTheChurch,
      notes: userData.notes,
      stake: stake,
      roles: [role],
    });

    const savedUser = await this.userRepository.save(user);

    this.logger.log(
      `✅ Created user: ${savedUser.firstName} ${savedUser.paternalLastName} (${role.name}) - Email: ${savedUser.email || 'N/A'} - Password: ${this.DEFAULT_PASSWORD}`,
    );

    return savedUser;
  }

  private async importFromCSV(): Promise<User[]> {
    const csvPath = path.join(__dirname, '../../../../../data.csv');
    const createdUsers: User[] = [];

    // Get the Participant role once
    const participantRole = await this.roleRepository.findOne({
      where: { name: 'Participant' },
    });

    if (!participantRole) {
      this.logger.error('Participant role not found, cannot import CSV users');
      return [];
    }

    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream(csvPath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          this.logger.log(`Found ${results.length} rows in CSV`);

          for (const row of results) {
            try {
              // Parse CSV columns
              const nombre = row['Nombre']?.trim();
              const apellidos = row['Apellidos']?.trim();
              const estacaName = row['Estaca']?.trim();
              const barrio = row['Barrio']?.trim();
              const edad = row['Edad']?.trim();
              const esMiembro = row['esMiembro']?.trim();
              const tallerPropuesto = row['tallerPropuesto']?.trim();

              // Skip if no name
              if (!nombre || !apellidos) {
                this.logger.warn('Skipping row with missing name');
                continue;
              }

              // Split last names (Apellidos contains both paternalLastName and maternalLastName)
              const nombresArray = nombre.split(' ');
              const firstName = nombresArray[0] || '';
              const middleName =
                nombresArray.length > 1 ? nombresArray.slice(1).join(' ') : '';

              const apellidosArray = apellidos.split(' ');
              const paternalLastName = apellidosArray[0] || '';
              const maternalLastName =
                apellidosArray.length > 1
                  ? apellidosArray.slice(1).join(' ')
                  : '';

              // Find stake
              let stake = null;
              if (estacaName) {
                stake = await this.stakeRepository.findOne({
                  where: { name: estacaName },
                });

                if (!stake) {
                  this.logger.warn(
                    `Stake '${estacaName}' not found in database`,
                  );
                }
              }

              // Parse isMemberOfTheChurch
              const isMemberOfTheChurch =
                esMiembro?.toLowerCase() === 'si' ||
                esMiembro?.toLowerCase() === 'sí';

              // Check if user already exists (by first name + last name combination)
              const existingUser = await this.userRepository.findOne({
                where: {
                  firstName: nombre,
                  paternalLastName: paternalLastName,
                },
              });

              if (existingUser) {
                this.logger.log(
                  `User ${nombre} ${paternalLastName} already exists, skipping...`,
                );
                continue;
              }

              // Create user
              const user = this.userRepository.create({
                firstName: firstName,
                middleName: middleName || undefined,
                paternalLastName: paternalLastName,
                maternalLastName: maternalLastName || undefined,
                ward: barrio || undefined,
                age: edad || undefined,
                isMemberOfTheChurch: isMemberOfTheChurch,
                notes: tallerPropuesto || undefined,
                password: this.DEFAULT_PASSWORD,
                stake: stake,
                roles: [participantRole],
              });

              const savedUser = await this.userRepository.save(user);
              createdUsers.push(savedUser);

              this.logger.log(
                `✅ Imported participant from CSV: ${savedUser.firstName} ${savedUser.paternalLastName} - Stake: ${stake?.name || 'N/A'}`,
              );
            } catch (error) {
              this.logger.error(
                `Error importing CSV row: ${error.message}`,
                row,
              );
            }
          }

          this.logger.log(
            `CSV import completed. Total imported: ${createdUsers.length}`,
          );
          resolve(createdUsers);
        })
        .on('error', (error) => {
          this.logger.error(`Error reading CSV: ${error.message}`);
          reject(error);
        });
    });
  }
}
