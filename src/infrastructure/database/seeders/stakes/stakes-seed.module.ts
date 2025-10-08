import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stake } from '@app/modules/stakes/entities/stake.entity';
import { StakesSeedService } from './stakes-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stake])],
  providers: [StakesSeedService],
  exports: [StakesSeedService],
})
export class StakesSeedModule {}
