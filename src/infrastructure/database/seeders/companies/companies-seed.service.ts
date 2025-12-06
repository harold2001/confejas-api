import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '@app/modules/companies/entities/company.entity';

@Injectable()
export class CompaniesSeedService {
  private readonly logger = new Logger(CompaniesSeedService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async seed(): Promise<Company[]> {
    const amount = 22;
    const created: Company[] = [];

    for (let i = 0; i < amount; i++) {
      const name = `Compañía ${i + 1}`;
      const description = '';

      // Check if company already exists
      const existingCompany = await this.companyRepository.findOne({
        where: { name },
      });

      if (existingCompany) {
        this.logger.log(`Company ${name} already exists, skipping...`);
        created.push(existingCompany);
        continue;
      }

      // Create new company
      const company = this.companyRepository.create({
        name,
        description,
        number: i + 1,
      });
      const savedCompany = await this.companyRepository.save(company);
      created.push(savedCompany);

      this.logger.log(`✅ Created company: ${savedCompany.name}`);
    }

    this.logger.log(`Companies seeding completed. Total: ${created.length}`);
    return created;
  }
}
