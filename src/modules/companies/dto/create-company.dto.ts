import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Company description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
