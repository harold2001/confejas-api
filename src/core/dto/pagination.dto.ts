import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PaginationOrderDir } from '../enums/pagination';
import { IPaginationDto } from '@core/interfaces';
import { Type } from 'class-transformer';

export class PaginationDto implements IPaginationDto {
  // Size of page
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  // Number to skip.  PageNumber x PageSize
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  // String path to apply ordering. Example: name or user.name or user.books.name
  @IsString()
  @IsOptional()
  orderBy?: string;

  // String to indicate sorting direction
  @IsString()
  @IsEnum(PaginationOrderDir)
  @IsOptional()
  orderDir?: PaginationOrderDir;
}
