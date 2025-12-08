import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDateString,
  IsBoolean,
  IsUUID,
  MaxLength,
  MinLength,
  IsArray,
  ArrayMinSize,
  Length,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@app/core/enums/gender';

export class CreateUserDto {
  @ApiProperty({
    description: 'First name',
    example: 'Celeste Mariyen',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Middle name',
    example: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  middleName?: string;

  @ApiProperty({
    description: 'Paternal last name',
    example: 'Aguinaga',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  paternalLastName: string;

  @ApiProperty({
    description: 'Maternal last name',
    example: 'Aguayo',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  maternalLastName?: string;

  @ApiProperty({
    description: 'DNI (Documento Nacional de Identidad) - 8 digits',
    example: '72767381',
    required: false,
  })
  @IsOptional()
  @ValidateIf((o) => o.dni && o.dni.length > 0)
  @IsString()
  @Length(8, 8, { message: 'DNI debe tener exactamente 8 dígitos' })
  dni?: string;

  @ApiProperty({
    description: 'Birth date',
    example: '1999-10-07',
    required: false,
  })
  @IsString()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({
    description: 'Gender',
    example: 'Female',
    required: false,
  })
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    description: 'Phone number',
    example: '980873771',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'cmariyenaguinaga@gmail.com',
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'Password for user authentication',
    example: 'SecurePassword123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Physical address',
    example: 'Mz I lote 33 urb. San Diego',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @ApiProperty({
    description: 'Department',
    example: 'Lima',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  department?: string;

  @ApiProperty({
    description: 'Has the user arrived?',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hasArrived?: boolean;

  @ApiProperty({
    description: 'Medical condition',
    example: 'Diabetes tipo 2',
    required: false,
  })
  @IsString()
  @IsOptional()
  medicalCondition?: string;

  @ApiProperty({
    description: 'Medical treatment',
    example: 'Insulina',
    required: false,
  })
  @IsString()
  @IsOptional()
  medicalTreatment?: string;

  @ApiProperty({
    description: 'Key code',
    example: 'KEY001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  keyCode?: string;

  @ApiProperty({
    description: 'Ward (Barrio)',
    example: 'San Juan',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  ward?: string;

  @ApiProperty({
    description: 'Age',
    example: '25',
    required: false,
  })
  @IsString()
  @IsOptional()
  age?: string;

  @ApiProperty({
    description: 'Is member of the church',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isMemberOfTheChurch?: boolean;

  @ApiProperty({
    description: 'Notes',
    example: 'Taller de fotografía',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Shirt size',
    example: 'M',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  shirtSize?: string;

  @ApiProperty({
    description: 'Blood type',
    example: 'O+',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  bloodType?: string;

  @ApiProperty({
    description: 'Health insurance',
    example: 'EsSalud',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  healthInsurance?: string;

  @ApiProperty({
    description: 'Emergency contact name',
    example: 'María Aguinaga',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  emergencyContactName?: string;

  @ApiProperty({
    description: 'Emergency contact phone',
    example: '987654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  emergencyContactPhone?: string;

  @ApiProperty({
    description: 'Array of Role IDs - Users can have multiple roles',
    example: ['uuid-string-1', 'uuid-string-2'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  roleIds: string[];

  @ApiProperty({
    description: 'Stake ID',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  stakeId?: string;

  @ApiProperty({
    description: 'Company ID',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  companyId?: string;

  @IsOptional()
  roomId?: string;
}
