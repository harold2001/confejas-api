import { Injectable, Logger } from '@nestjs/common';
import { ILike } from 'typeorm';
import { User } from '@app/modules/users/entities/user.entity';
import { usersData } from './users-seed.data';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import {
  getGenderFromString,
  getUserStatusFromString,
} from '@app/core/utils/helpers';
import { RoleRepository } from '@app/modules/roles/repositories/roles.repository';
import { StakeRepository } from '@app/modules/stakes/repositories/stakes.repository';
import { CompanyRepository } from '@app/modules/companies/repositories/companies.repository';
import { UserRepository } from '@app/modules/users/repositories/users.repository';
import { RoomRepository } from '@app/modules/rooms/repositories/rooms.repository';
import { UserRoomRepository } from '@app/modules/user-rooms/repositories/user-rooms.repository';

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

  private async importFromCSV(): Promise<User[]> {
    const csvPath = path.join(__dirname, '../../../../../data.csv');
    const createdUsers: User[] = [];

    // Get the Participant role once
    const participantRole = await this.roleRepository.findOne({
      name: 'Participant',
    });

    const staffRole = await this.roleRepository.findOne({
      name: 'Staff',
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
              const firstName = row['Primer Nombre']?.trim();
              const middleName = row['Segundo Nombre']?.trim();
              const paternalLastName = row['Primer Apellido']?.trim();
              const maternalLastName = row['Segundo Apellido']?.trim();
              const stakeName = row['Estaca']?.trim();
              const wardName = row['Barrio']?.trim();
              const status = row['Estado']?.trim();
              const companyNumber = row['Compañias']?.trim();
              const roomNumber = row['Habitación']?.trim();
              const birthDateRaw = row['Fecha de nacimiento2']?.trim();
              const gender = row['Sexo']?.trim();
              const phoneNumberRaw =
                row['Número de celular (incluya el indicador de pais)']?.trim();
              const email = row['Correo electrónico']?.trim();
              const age = row['Edad']?.trim();

              const shirtSize = row['Elija el tamaño de su camiseta']?.trim();
              const isChurchMember =
                row[
                  '¿Eres miembro de la Iglesia de Jesucristo de los Santos de los Últimos Días?'
                ]?.trim();
              const bloodType = row['Grupo sanguíneo y factor (RH)']?.trim();
              const medicalCondition =
                row[
                  '¿Sufres de algún tipo de enfermedad crónica? Cuál es?'
                ]?.trim();
              const medicalTreatment =
                row['¿Recibes algún tipo de tratamiento médico?']?.trim();
              const healthInsurance =
                row['¿Con qué seguro médico cuentas?']?.trim();
              const emergencyContactName =
                row['Nombre y Apellido - Persona de contacto']?.trim();
              const emergencyContactPhoneRaw =
                row['Teléfono - Persona de contacto']?.trim();

              // Convert birthDate from MM/DD/YYYY to YYYY-MM-DD
              let birthDate: string | undefined = undefined;
              if (birthDateRaw) {
                const [month, day, year] = birthDateRaw.split('/');
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

              // Check if user already exists (by first name + last name combination)
              const existingUser = await this.userRepository.findOne({
                firstName: firstName,
                middleName: middleName || undefined,
                paternalLastName: paternalLastName,
                maternalLastName: maternalLastName || undefined,
              });

              // Find stake
              const stake = stakeName
                ? await this.stakeRepository.findOne({
                    name: stakeName,
                  })
                : null;

              const company = companyNumber
                ? await this.companyRepository.findOne({
                    number: Number(companyNumber),
                  })
                : null;

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

              if (existingUser) {
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
                roles: [status === 'Staff' ? staffRole : participantRole],
                status: status ? getUserStatusFromString(status) : undefined,
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
