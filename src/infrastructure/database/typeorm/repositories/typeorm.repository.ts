import { BaseModel } from '@core/models/base.model';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { GenericRepository } from '@core/abstracts/generic-repository';
import { PaginationDto } from '@app/core/dto/pagination.dto';
import { PageResult } from '@app/core/interfaces';
import { NotFoundException } from '@nestjs/common';

export abstract class TypeOrmRepository<Entity extends BaseModel>
  implements GenericRepository<Entity>
{
  protected relations: string[] = [];
  protected paginatedRelations: string[] = [];
  protected orderBy: FindOptionsOrder<Entity> = {};

  protected constructor(protected readonly repository: Repository<Entity>) {}

  findAll<FilterInput>(filters?: FilterInput): Promise<Entity[]> {
    const parsedFilters = this.parseFilters(filters || {});
    return this.repository.find({
      where: parsedFilters,
      relations: this.relations,
    });
  }

  async findAllPaginated<FilterInput>(
    pagination: PaginationDto,
    filters?: FilterInput,
  ): Promise<PageResult<Entity>> {
    const { limit, skip, orderBy = 'createdAt', orderDir } = pagination;
    const parsedFilters = this.parseFilters(filters);
    const [data, count] = await this.repository.findAndCount({
      where: parsedFilters,
      relations: this.paginatedRelations,
      take: limit,
      skip: skip,
      order: {
        [orderBy]: orderDir || 'ASC',
      } as FindOptionsOrder<Entity>,
    });

    return {
      data,
      count,
    };
  }

  findById(id: string): Promise<Entity> {
    return this.repository.findOne({
      where: {
        id: id,
      } as FindOptionsWhere<Entity>,
      relations: this.relations,
      order: this.orderBy,
    });
  }

  findByIds(ids: number[]): Promise<Entity[]> {
    return this.repository.find({
      where: {
        id: In(ids),
      } as FindOptionsWhere<Entity>,
      order: this.orderBy,
      relations: this.relations,
    });
  }

  async create(entity: Entity | DeepPartial<Entity>): Promise<Entity> {
    return this.repository.create(entity).save();
  }

  async update(
    id: string,
    entity: Entity | DeepPartial<Entity>,
  ): Promise<Entity> {
    const updatedEntity = await this.repository.preload({ id, ...entity });
    return this.repository.save(updatedEntity);
  }

  async delete(id: string): Promise<Entity> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
      relations: this.relations,
    });

    if (!entity) {
      throw new NotFoundException('Not found');
    }

    await this.repository.remove(entity);
    return entity;
  }

  async softDelete(id: string): Promise<Entity> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
      relations: this.relations,
    });

    if (!entity) {
      throw new NotFoundException('Not found');
    }

    await this.repository.softDelete(id);
    return entity;
  }

  findOne<FilterInput>(
    filters: FilterInput,
    withDeleted: boolean = false,
  ): Promise<Entity> {
    const parsedFilters = this.parseFilters(filters);
    return this.repository.findOne({
      where: parsedFilters,
      relations: this.relations,
      order: this.orderBy,
      withDeleted,
    });
  }

  protected abstract parseFilters<FilterInput>(
    filters?: FilterInput,
  ): FindOptionsWhere<Entity>;
}
