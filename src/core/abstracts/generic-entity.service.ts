import { Logger } from '@nestjs/common';
import { GenericRepository } from './generic-repository';
import { PageResult } from '@core/interfaces';
import { PaginationDto } from '@core/dto/pagination.dto';

export abstract class GenericEntityService<T> {
  protected name: string;
  protected logger: Logger;

  protected constructor(
    protected repository: GenericRepository<T>,
    name: string,
  ) {
    this.name = name;
    this.logger = new Logger(`GenericService ${this.name}`);
  }

  public async create(createInput: Partial<T>): Promise<T> {
    try {
      this.logger.debug({ message: 'Operation create', createInput });
      return await this.repository.create(createInput);
    } catch (err) {
      this.logger.error({ message: `ERROR: operation create` });
      this.logger.error(err);
    }
  }

  public async findAll(): Promise<T[]> {
    try {
      this.logger.debug({ message: 'Operation findAll' });
      return await this.repository.findAll();
    } catch (err) {
      this.logger.error({ message: 'ERROR: operation findAll' });
      this.logger.error(err);
    }
  }

  public async findAllPaginated<FilterInput>(
    pagination?: PaginationDto,
    filters?: FilterInput,
  ): Promise<PageResult<T>> {
    try {
      this.logger.debug({
        message: 'Operation findAllPaginated',
        pagination,
        filters,
      });
      return this.repository.findAllPaginated(pagination, filters);
    } catch (err) {
      this.logger.error({
        message: 'ERROR: operation findAllPaginated',
        pagination,
        filters,
      });
      this.logger.error(err);
    }

    // return null;
  }

  public async findById(id: number): Promise<T> {
    try {
      this.logger.debug({ message: 'Operation findById', id });
      return await this.repository.findById(id);
    } catch (err) {
      this.logger.error({ message: 'ERROR: operation findById', id });
      this.logger.error(err);
    }
  }

  public async findOne<FilterInput>(filters?: FilterInput): Promise<T> {
    try {
      this.logger.debug({ message: 'Operation findOne', filters });
      return await this.repository.findOne(filters);
    } catch (err) {
      this.logger.error({ message: 'ERROR: operation findOne', filters });
      this.logger.error(err);
    }
  }

  public async update(id: number, updateInput: Partial<T>): Promise<T> {
    try {
      this.logger.debug({ message: 'Operation update', id, updateInput });
      return await this.repository.update(id, updateInput);
    } catch (err) {
      this.logger.error({
        message: 'ERROR: operation findOne',
        id,
        updateInput,
      });
      this.logger.error(err);
    }
  }

  public async remove(id: number): Promise<T> {
    try {
      this.logger.debug({ message: 'Operation remove', id });
      return await this.repository.delete(id);
    } catch (e) {
      this.logger.error({ message: 'ERROR: operation remove', id });
      this.logger.error(e);
    }
  }
}
