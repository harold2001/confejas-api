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
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'DNI (Documento Nacional de Identidad)',
    example: '72767381',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  dni: string;

  @ApiProperty({
    description: 'Birth date',
    example: '1999-10-07',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @ApiProperty({
    description: 'Gender',
    example: 'Female',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  gender?: string;

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
    description: 'Physical address',
    example: 'Mz I lote 33 urb. San Diego',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @ApiProperty({
    description: 'Region',
    example: 'Lima',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  region?: string;

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
    description: 'Key code',
    example: 'KEY001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  keyCode?: string;

  @ApiProperty({
    description: 'Password for user authentication',
    example: 'SecurePassword123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Array of Role IDs - Users can have multiple roles',
    example: ['uuid-string-1', 'uuid-string-2'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  roleIds: string[];
}
