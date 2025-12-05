import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '@app/modules/companies/entities/company.entity';
import { companiesData } from './companies-seed.data';

@Injectable()
export class CompaniesSeedService {
  private readonly logger = new Logger(CompaniesSeedService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async seed(): Promise<Company[]> {
    const createdCompanies: Company[] = [];

    for (const companyData of companiesData) {
      // Check if company already exists
      const existingCompany = await this.companyRepository.findOne({
        where: { name: companyData.name },
      });

      if (existingCompany) {
        this.logger.log(
          `Company ${companyData.name} already exists, skipping...`,
        );
        createdCompanies.push(existingCompany);
        continue;
      }

      // Create new company
      const company = this.companyRepository.create(companyData);
      const savedCompany = await this.companyRepository.save(company);
      createdCompanies.push(savedCompany);

      this.logger.log(`✅ Created company: ${savedCompany.name}`);
    }

    this.logger.log(
      `Companies seeding completed. Total: ${createdCompanies.length}`,
    );
    return createdCompanies;
  }
}
