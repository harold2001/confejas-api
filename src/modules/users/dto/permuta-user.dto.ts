import { IsUUID, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class PermutaUserDto extends CreateUserDto {
  @ApiProperty({
    description: 'ID del usuario original que está siendo reemplazado',
    example: 'da0742fc-1c05-49ff-a14f-ed87c785ea2d',
  })
  @IsUUID()
  @IsNotEmpty()
  originalUserId: string;
}

export class PermutaExistingUserDto {
  @IsOptional()
  permutaUserId: string;

  @IsNotEmpty()
  originalUserId: string;

  @IsBoolean()
  isExisting: boolean;
}
