import { Controller, Get } from '@nestjs/common';
import { StakesService } from './stakes.service';

@Controller('stakes')
export class StakesController {
  constructor(private readonly stakesService: StakesService) {}

  @Get()
  findAll() {
    return this.stakesService.findAll();
  }
}
