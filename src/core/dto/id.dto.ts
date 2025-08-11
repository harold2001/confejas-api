import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class IdDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  driverId?: number;
}
