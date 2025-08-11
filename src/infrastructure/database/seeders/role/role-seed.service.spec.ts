import { Test, TestingModule } from '@nestjs/testing';
import { RoleSeedService } from './role-seed.service';

describe('RoleSeedService', () => {
  let service: RoleSeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleSeedService],
    }).compile();

    service = module.get<RoleSeedService>(RoleSeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
