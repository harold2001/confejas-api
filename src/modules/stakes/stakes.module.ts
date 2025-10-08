import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakesService } from './stakes.service';
import { StakesController } from './stakes.controller';
import { StakeRepository } from './repositories/stakes.repository';
import { Stake } from './entities/stake.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stake])],
  controllers: [StakesController],
  providers: [StakesService, StakeRepository],
  exports: [StakesService],
})
export class StakesModule {}
