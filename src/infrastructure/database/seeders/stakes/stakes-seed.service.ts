import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { stakesData } from './stakes-seed.data';
import { Stake } from '@app/modules/stakes/entities/stake.entity';

@Injectable()
export class StakesSeedService {
  private readonly logger = new Logger(StakesSeedService.name);

  constructor(
    @InjectRepository(Stake)
    private readonly stakeRepository: Repository<Stake>,
  ) {}

  async seed(): Promise<Stake[]> {
    const createdStakes: Stake[] = [];

    for (const stakeData of stakesData) {
      // Check if stake already exists by name
      const existingStake = await this.stakeRepository.findOne({
        where: { name: stakeData.name },
      });

      if (existingStake) {
        this.logger.log(`Stake ${stakeData.name} already exists, skipping...`);
        createdStakes.push(existingStake);
        continue;
      }

      // Create new stake
      const stake = this.stakeRepository.create({
        name: stakeData.name,
      });

      const savedStake = await this.stakeRepository.save(stake);
      createdStakes.push(savedStake);

      this.logger.log(`✅ Created stake: ${savedStake.name}`);
    }

    this.logger.log(`Stakes seeding completed. Total: ${createdStakes.length}`);
    return createdStakes;
  }
}
