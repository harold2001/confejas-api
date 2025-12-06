import { UserStatus } from '@app/core/enums/user-status';
import { Gender } from '@app/core/enums/gender';

export class FilterUserDto {
  searchName?: string;
  name?: string;
  email?: string;
  roleNames?: string[];
  firstName?: string;
  middleName?: string;
  paternalLastName?: string;
  maternalLastName?: string;
  dni?: string;
  phone?: string;
  address?: string;
  department?: string;
  hasArrived?: boolean;
  medicalCondition?: string;
  medicalTreatment?: string;
  hasMedicalCondition?: boolean;
  hasMedicalTreatment?: boolean;
  keyCode?: string;
  ward?: string;
  stakeId?: string;
  stakeName?: string;
  age?: string;
  isMemberOfTheChurch?: boolean;
  notes?: string;
  status?: UserStatus;
  shirtSize?: string;
  bloodType?: string;
  healthInsurance?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  gender?: Gender;
  birthDate?: string;
}
