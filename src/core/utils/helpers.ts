import { Gender } from '../enums/gender';
import { UserStatus } from '../enums/user-status';

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
  return trimmed === '#ERROR!' || trimmed === '' ? undefined : trimmed;
};
