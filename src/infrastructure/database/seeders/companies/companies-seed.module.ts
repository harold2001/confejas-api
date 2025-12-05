import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '@app/modules/companies/entities/company.entity';
import { CompaniesSeedService } from './companies-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompaniesSeedService],
  exports: [CompaniesSeedService],
})
export class CompaniesSeedModule {}
