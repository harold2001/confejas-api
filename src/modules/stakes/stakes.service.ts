import { Injectable } from '@nestjs/common';
import { StakeRepository } from './repositories/stakes.repository';

@Injectable()
export class StakesService {
  constructor(private readonly stakeRepository: StakeRepository) {}

  findAll() {
    return this.stakeRepository.findAll();
  }
}
