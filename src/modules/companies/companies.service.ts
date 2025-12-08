import { Injectable } from '@nestjs/common';
import { CompanyRepository } from './repositories/companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyStatisticsDto } from './dto/statistics.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyRepository.create(createCompanyDto);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }

  async findOne(id: string): Promise<Company> {
    return this.companyRepository.findById(id);
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyRepository.update(id, updateCompanyDto);
  }

  async remove(id: string): Promise<void> {
    await this.companyRepository.delete(id);
  }

  async findAllWithUserCount(): Promise<
    Array<Company & { userCount: number }>
  > {
    return this.companyRepository.findAllWithUserCount();
  }

  async getStatistics(): Promise<CompanyStatisticsDto[]> {
    const companies = await this.companyRepository.findAll();
    const statisticsMap = new Map<string, CompanyStatisticsDto>();

    for (const company of companies) {
      if (!statisticsMap.has(company.id)) {
        statisticsMap.set(company.id, {
          companyId: company.id,
          companyName: company.name,
          companyNumber: company.number,
          userCount: company.users.length,
          usersArrived: company.users.filter((u) => u.hasArrived).length,
          usersNotArrived: company.users.filter((u) => !u.hasArrived).length,
        });
      }
    }

    return Array.from(statisticsMap.values());
  }
}
