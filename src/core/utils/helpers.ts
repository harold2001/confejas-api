import { Company } from '@app/modules/companies/entities/company.entity';
import { Gender } from '../enums/gender';
import { UserStatus } from '../enums/user-status';
import { Role } from '@app/modules/roles/entities/role.entity';

export const getUserStatusFromString = (status: string): UserStatus | null => {
  switch (status?.toLowerCase()) {
    case 'asistirá':
    case 'asistira':
      return UserStatus.ASISTIRA;
    case 'no asistirá':
    case 'no asistira':
      return UserStatus.NO_ASISTIRA;
    case 'por confirmar':
    case 'por confrimar':
      return UserStatus.POR_CONFIRMAR;
    case 'staff':
      return UserStatus.STAFF;
    default:
      return null;
  }
};

export const getGenderFromString = (gender: string): Gender | null => {
  switch (gender?.toLowerCase()) {
    case 'masculino':
      return Gender.MALE;
    case 'femenino':
      return Gender.FEMALE;
    case 'otro':
      return Gender.OTHER;
    default:
      return null;
  }
};

export const cleanValue = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === '#ERROR!' || trimmed === '' || trimmed === 'NO VINO!'
    ? undefined
    : trimmed;
};

export const getMiddleNameFromFullName = (
  fullName: string,
): string | undefined => {
  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length > 1) {
    return nameParts.slice(1).join(' ');
  }

  return undefined;
};

export const getEachLastNameFromFullLastName = (
  fullLastName: string,
): { paternalLastName: string; maternalLastName?: string } => {
  const nameParts = fullLastName.trim().split(/\s+/);

  return {
    paternalLastName: nameParts[0],
    maternalLastName:
      nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined,
  };
};

export const resolveCompany = (
  companyNumber: string,
  companies: Company[],
): Company | undefined => {
  if (companyNumber === 'consejero') return undefined;

  if (companyNumber === 'staff') {
    return companies.find((c) => c.name === 'Compañía Staff');
  }

  return companies.find((c) => c.number === parseInt(companyNumber, 10));
};

export const resolveRoomNumber = (roomNumber: string) => {
  if (!roomNumber || roomNumber.toLocaleLowerCase() === 'pendiente') {
    return undefined;
  }

  if (roomNumber.includes('Bungalows')) {
    return roomNumber.replace('Bungalows', 'B').replace(' ', '').trim();
  }

  return roomNumber;
};

export const resolveRoles = (
  status: string,
  companyNumber: string,
  roles: Role[],
): Role[] => {
  if (status === 'PARTICIPANTE') {
    return roles.filter((r) => r.name === 'Participant');
  }

  if (status === 'ADMIN') {
    return roles.filter((r) => r.name === 'Admin');
  }

  if (companyNumber === 'consejero') {
    return roles.filter((r) => r.name === 'Counselor');
  }

  if (status === 'STAFF') {
    return roles.filter((r) => r.name === 'Staff');
  }
};
