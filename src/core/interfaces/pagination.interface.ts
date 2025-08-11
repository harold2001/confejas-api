import { PaginationOrderDir } from '../enums/pagination';

export interface PageMetadata {
  count: number;
}

export interface PageResult<T> extends PageMetadata {
  data: T[];
}

export interface IPaginationDto {
  limit?: number;
  skip?: number;
  orderBy?: string;
  orderDir?: PaginationOrderDir;
}
