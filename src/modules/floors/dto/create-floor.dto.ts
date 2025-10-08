import { IsNumber, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFloorDto {
  @ApiProperty({
    description: 'Floor number',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  number: number;

  @ApiProperty({
    description: 'Building ID',
    example: 'uuid-string',
  })
  @IsUUID()
  @IsNotEmpty()
  buildingId: string;
}
