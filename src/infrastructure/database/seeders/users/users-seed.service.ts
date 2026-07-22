import { Injectable, Logger } from '@nestjs/common';
import { ILike } from 'typeorm';
import { User } from '@app/modules/users/entities/user.entity';
import { usersData } from './users-seed.data';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import {
  cleanValue,
  getGenderFromString,
  getUserStatusFromString,
  resolveCompany,
  resolveRoles,
  resolveRoomNumber,
} from '@app/core/utils/helpers';
import { RoleRepository } from '@app/modules/roles/repositories/roles.repository';
import { StakeRepository } from '@app/modules/stakes/repositories/stakes.repository';
import { CompanyRepository } from '@app/modules/companies/repositories/companies.repository';
import { UserRepository } from '@app/modules/users/repositories/users.repository';
import { RoomRepository } from '@app/modules/rooms/repositories/rooms.repository';
import { UserRoomRepository } from '@app/modules/user-rooms/repositories/user-rooms.repository';
import { UserStatus } from '@app/core/enums/user-status';

@Injectable()
export class UsersSeedService {
  private readonly logger = new Logger(UsersSeedService.name);
  private readonly DEFAULT_PASSWORD = 'password';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly stakeRepository: StakeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly roomRepository: RoomRepository,
    private readonly userRoomRepository: UserRoomRepository,
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
    // this.logger.log('Importing participants from CSV...');
    // const csvUsers = await this.importFromCSV();
    // createdUsers.push(...csvUsers);

    this.logger.log(`Users seeding completed. Total: ${createdUsers.length}`);
    this.logger.log(
      `⚠️  All seeded users have the default password: "${this.DEFAULT_PASSWORD}"`,
    );
    return createdUsers;
  }

  async importUsers(): Promise<User[]> {
    this.logger.log('Importing users from CSV...');
    const csvUsers = await this.importFromCSV('import-users.csv', true);
    this.logger.log(`Users import completed. Total: ${csvUsers.length}`);
    this.logger.log(
      `⚠️  All imported users have the default password: "${this.DEFAULT_PASSWORD}"`,
    );
    return csvUsers;
  }

  private async createUser(userData: any): Promise<User | null> {
    // Find the role for this user
    const role = await this.roleRepository.findOne({
      name: userData.roleName,
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
        name: userData.stakeName,
      });

      if (!stake) {
        this.logger.warn(
          `Stake '${userData.stakeName}' not found for user ${userData.firstName} ${userData.paternalLastName}`,
        );
      }
    }

    // Find company if provided
    let company = null;
    if (userData.companyName) {
      company = await this.companyRepository.findOne({
        name: userData.companyName,
      });

      if (!company) {
        this.logger.warn(
          `Company '${userData.companyName}' not found for user ${userData.firstName} ${userData.paternalLastName}`,
        );
      }
    }

    // Check if user already exists by email (if provided)
    if (userData.email) {
      const existingUser = await this.userRepository.findOne({
        firstName: userData?.firstName,
        middleName: userData?.middleName || undefined,
        paternalLastName: userData?.paternalLastName,
        maternalLastName: userData?.maternalLastName || undefined,
      });

      if (existingUser) {
        this.logger.log(
          `User with email ${userData.email} already exists, skipping...`,
        );
        return existingUser;
      }
    }

    // Create new user
    const savedUser = await this.userRepository.create({
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
      department: userData.department,
      medicalCondition: userData.medicalCondition,
      keyCode: userData.keyCode,
      ward: userData.ward,
      age: userData.age,
      isMemberOfTheChurch: userData.isMemberOfTheChurch,
      notes: userData.notes,
      stake: stake,
      company: company,
      roles: [role],
    });

    this.logger.log(
      `✅ Created user: ${savedUser.firstName} ${savedUser.paternalLastName} (${role.name}) - Email: ${savedUser.email || 'N/A'} - Password: ${this.DEFAULT_PASSWORD}`,
    );

    return savedUser;
  }

  private async importFromCSV(
    filename: string = 'data.csv',
    skipExisting = false,
  ): Promise<User[]> {
    const csvPath = path.join(__dirname, '../../../../../', filename);
    const createdUsers: User[] = [];

    // Get the Participant role once
    const roles = await this.roleRepository.findAll();

    const companies = await this.companyRepository.findAll();

    if (!roles.length) {
      this.logger.error('Roles not found, cannot import CSV users');
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
              const firstName = cleanValue(row['Primer nombre']);
              const middleName = cleanValue(row['Segundo nombre']);
              const paternalLastName = cleanValue(row['Primer apellido']);
              const maternalLastName = cleanValue(row['Segundo apellido']);
              const preferredName = cleanValue(row['Nombre de preferencia']);
              const status = cleanValue(row['Status']) as
                | 'PARTICIPANTE'
                | 'STAFF'
                | 'ADMIN';
              const birthDateRaw = cleanValue(row['Fecha de Nacimiento']);
              const gender = cleanValue(row['Sexo']);
              const phoneNumberRaw = cleanValue(
                row['Número de celular (incluya el indicador de pais)'],
              );
              const email = cleanValue(row['Correo Electrónico']);
              const age = cleanValue(row['Edad']);
              const shirtSize = cleanValue(
                row['Elija el tamaño de su camiseta'],
              );
              const isChurchMember = cleanValue(
                row[
                  '¿Miembro de la iglesia de Jesucristo de los Santos de los Últimos días?'
                ] as 'SI' | 'NO' | '',
              );
              const stakeName = cleanValue(
                row[
                  'Seleccione su estaca, distrito o misión para ramas de misión'
                ],
              );
              const wardName = cleanValue(row['Barrio o Rama']);
              const bloodType = cleanValue(
                row['Grupo sanguíneo y factor (RH)'],
              );
              const medicalCondition = cleanValue(
                row['¿Sufres de algún tipo de enfermedad crónica? Cuál es?'],
              );
              const medicalTreatment = cleanValue(
                row['¿Recibes algún tipo de tratamiento médico?'],
              );
              const healthInsurance = cleanValue(
                row['¿Con qué seguro médico cuentas?'],
              );
              const emergencyContactName = cleanValue(
                row['Nombre y Apellido - Persona de contacto'],
              );
              const emergencyContactPhoneRaw = cleanValue(
                row['Teléfono - Persona de contacto'],
              );
              const companyNumber = cleanValue(row['Compañias'])
                ?.toLowerCase()
                ?.replace('compañia', '')
                ?.replace('compañía', '')
                ?.trim(); // We just want the number, not the word "Compañia"
              const roomNumber = resolveRoomNumber(
                cleanValue(row['Habitación']),
              );

              // Convert birthDate to YYYY-MM-DD (auto-detect format)
              let birthDate: string | undefined = undefined;
              if (birthDateRaw) {
                const parts = birthDateRaw.split('/');
                const firstValue = parseInt(parts[0]);
                const year = parts[2];

                let month, day;
                // If first value > 12, it must be day (DD/MM/YYYY format)
                // Otherwise, assume month (MM/DD/YYYY format)
                if (firstValue > 12) {
                  day = parts[0];
                  month = parts[1];
                } else {
                  month = parts[0];
                  day = parts[1];
                }

                if (month && day && year) {
                  birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                }
              }

              // Clean phone number: remove country code (51) if present, keep only 9 digits
              let phoneNumber: string | undefined = undefined;
              if (phoneNumberRaw) {
                // Remove all non-digit characters
                const digits = phoneNumberRaw.replace(/\D/g, '');
                // If starts with 51 and has more than 9 digits, remove the 51
                if (digits.startsWith('51') && digits.length > 9) {
                  phoneNumber = digits.substring(2, 11); // Take 9 digits after 51
                } else {
                  phoneNumber = digits.substring(0, 9); // Take first 9 digits
                }
                // If phone number is empty or invalid length, set to undefined
                if (!phoneNumber || phoneNumber.length !== 9) {
                  phoneNumber = undefined;
                }
              }

              // Clean emergency contact phone number: same logic as phone number
              let emergencyContactPhone: string | undefined = undefined;
              if (emergencyContactPhoneRaw) {
                // Remove all non-digit characters
                const digits = emergencyContactPhoneRaw.replace(/\D/g, '');
                // If starts with 51 and has more than 9 digits, remove the 51
                if (digits.startsWith('51') && digits.length > 9) {
                  emergencyContactPhone = digits.substring(2, 11); // Take 9 digits after 51
                } else {
                  emergencyContactPhone = digits.substring(0, 9); // Take first 9 digits
                }
                // If phone number is empty or invalid length, set to undefined
                if (
                  !emergencyContactPhone ||
                  emergencyContactPhone.length !== 9
                ) {
                  emergencyContactPhone = undefined;
                }
              }

              // Skip if no name
              // if (!firstName || !paternalLastName) {
              //   this.logger.warn('Skipping row with missing name');
              //   continue;
              // }

              // Find stake
              const stake = stakeName
                ? await this.stakeRepository.findOne({
                    name: stakeName,
                  })
                : null;

              const company = resolveCompany(companyNumber, companies);

              if (stakeName && !stake) {
                this.logger.warn(`Stake '${stakeName}' not found in database`);
              }

              // Find or create room if roomNumber is provided
              let room = null;
              if (roomNumber) {
                room = await this.roomRepository.findOne({
                  roomNumber: roomNumber,
                });

                if (!room) {
                  // Create new room with only roomNumber
                  room = await this.roomRepository.create({
                    roomNumber: roomNumber,
                  });
                  this.logger.log(`🏠 Created new room: ${roomNumber}`);
                }
              }

              // Parse isMemberOfTheChurch
              const isMemberOfTheChurch =
                isChurchMember?.toLowerCase() === 'si' ||
                isChurchMember?.toLowerCase() === 'sí';

              // Check if user already exists (by first name + last name combination)

              const existingUser = await this.userRepository.findOne({
                firstName: firstName,
                middleName: middleName || undefined,
                paternalLastName: paternalLastName,
                maternalLastName: maternalLastName || undefined,
              });

              if (existingUser) {
                if (skipExisting) {
                  // Skip existing users when importing
                  this.logger.log(
                    `⏭️  User ${firstName} ${middleName || ''} ${paternalLastName} ${maternalLastName || ''} already exists, skipping...`,
                  );
                  continue;
                }

                // Check if any fields need updating
                let needsUpdate = false;
                const userToUpdate = new User();

                if (middleName && middleName !== existingUser.middleName) {
                  userToUpdate.middleName = middleName;
                  needsUpdate = true;
                }

                if (
                  maternalLastName &&
                  maternalLastName !== existingUser.maternalLastName
                ) {
                  userToUpdate.maternalLastName = maternalLastName;
                  needsUpdate = true;
                }

                if (wardName && wardName !== existingUser.ward) {
                  userToUpdate.ward = wardName;
                  needsUpdate = true;
                }

                if (age && age !== existingUser.age) {
                  userToUpdate.age = age;
                  needsUpdate = true;
                }

                if (isMemberOfTheChurch !== existingUser.isMemberOfTheChurch) {
                  userToUpdate.isMemberOfTheChurch = isMemberOfTheChurch;
                  needsUpdate = true;
                }

                if (stake && stake.id !== existingUser.stake?.id) {
                  userToUpdate.stake = stake;
                  needsUpdate = true;
                }

                if (phoneNumber && phoneNumber !== existingUser.phone) {
                  userToUpdate.phone = phoneNumber;
                  needsUpdate = true;
                }

                if (email && email !== existingUser.email) {
                  userToUpdate.email = email;
                  needsUpdate = true;
                }

                if (needsUpdate) {
                  // Update the existing user
                  const updatedUser = await this.userRepository.update(
                    existingUser.id,
                    userToUpdate,
                  );

                  createdUsers.push(updatedUser);

                  this.logger.log(
                    `🔄 Existing user updated: ${updatedUser.firstName} ${updatedUser.paternalLastName}}`,
                  );
                } else {
                  createdUsers.push(existingUser);

                  this.logger.log(
                    `✓ User ${firstName} ${middleName || ''} ${paternalLastName} ${maternalLastName || ''} already up to date, skipping...`,
                  );
                }
                continue;
              }

              // Create user
              const savedUser = await this.userRepository.create({
                firstName: firstName,
                middleName: middleName || undefined,
                paternalLastName: paternalLastName,
                maternalLastName: maternalLastName || undefined,
                preferredName: preferredName || undefined,
                birthDate: birthDate || undefined,
                gender: gender ? getGenderFromString(gender) : undefined,
                phone: phoneNumber || undefined,
                email: email || undefined,
                password: this.DEFAULT_PASSWORD,
                department: roomNumber || undefined,
                hasArrived: false,
                medicalCondition: medicalCondition || undefined,
                medicalTreatment: medicalTreatment || undefined,
                keyCode: undefined,
                ward: wardName || undefined,
                age: age || undefined,
                isMemberOfTheChurch: isMemberOfTheChurch,
                notes: undefined,
                stake: stake || undefined,
                company: company || undefined,
                roles: resolveRoles(status, companyNumber, roles),
                // status: status ? getUserStatusFromString(status) : undefined,
                status: UserStatus.ASISTIRA,
                shirtSize: shirtSize || undefined,
                bloodType: bloodType || undefined,
                healthInsurance: healthInsurance || undefined,
                emergencyContactName: emergencyContactName || undefined,
                emergencyContactPhone: emergencyContactPhone || undefined,
              });

              createdUsers.push(savedUser);

              // Create UserRoom relationship if room exists
              if (room) {
                await this.userRoomRepository.create({
                  user: savedUser,
                  room: room,
                });
              }

              this.logger.log(
                `✅ Imported participant from CSV: ${savedUser.firstName} ${savedUser.paternalLastName} - Stake: ${stake?.name || 'N/A'} - Room: ${room?.roomNumber || 'N/A'}`,
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
