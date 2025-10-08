import { PageResult } from '@core/interfaces';
import { PaginationDto } from '@core/dto/pagination.dto';
import { DeepPartial } from 'typeorm';

export abstract class GenericRepository<T> {
  abstract findAll(): Promise<T[]>;

  abstract findAllPaginated<FilterInput>(
    pagination: PaginationDto,
    filters?: FilterInput,
  ): Promise<PageResult<T>>;

  abstract findById(id: string): Promise<T>;

  abstract findOne<FilterInput>(filters: FilterInput): Promise<T>;

  abstract create(entity: T | DeepPartial<T>): Promise<T>;
  // abstract create(entity: Partial<T>): Promise<T>;
  abstract create<CreateInput>(entity: CreateInput): Promise<T>;

  abstract update(id: string, entity: T | DeepPartial<T>): Promise<T>;
  // abstract update(id: string, entity: Partial<T>): Promise<T>;
  abstract update<UpdateInput>(id: string, entity: UpdateInput): Promise<T>;

  abstract delete(id: string): Promise<T>;
}
