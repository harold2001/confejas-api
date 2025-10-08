import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildingDto {
  @ApiProperty({
    description: 'Building name',
    example: 'Building 1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
