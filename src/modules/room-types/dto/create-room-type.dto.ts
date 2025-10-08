import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomTypeDto {
  @ApiProperty({
    description: 'Room type name',
    example: 'Triple Room',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
