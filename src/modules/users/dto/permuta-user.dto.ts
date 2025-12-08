import { IsUUID, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType, IntersectionType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

class PermutaBaseDto {
  @ApiProperty({
    description: 'ID del usuario original que está siendo reemplazado',
    example: 'da0742fc-1c05-49ff-a14f-ed87c785ea2d',
  })
  @IsUUID()
  @IsNotEmpty()
  originalUserId: string;

  @ApiProperty({
    description: 'ID del usuario existente para permuta',
    example: '83779e47-b786-46e0-894e-6d2ddab675c3',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  permutaUserId?: string;

  @ApiProperty({
    description: 'Indica si se usa un usuario existente o se crea uno nuevo',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isExisting?: boolean;
}

export class PermutaUserDto extends IntersectionType(
  PermutaBaseDto,
  PartialType(CreateUserDto),
) {}
