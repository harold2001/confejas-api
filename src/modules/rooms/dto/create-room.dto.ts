import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Room number (unique identifier)',
    example: '284',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  roomNumber: string;

  @ApiProperty({
    description: 'Room Type ID',
    example: 'uuid-string',
  })
  @IsUUID()
  @IsNotEmpty()
  roomTypeId: string;

  @ApiProperty({
    description: 'Floor ID',
    example: 'uuid-string',
  })
  @IsUUID()
  @IsNotEmpty()
  floorId: string;

  @ApiProperty({
    description: 'Total number of beds in the room',
    example: 3,
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  totalBeds: number;
}
