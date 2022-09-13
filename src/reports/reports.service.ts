import { Injectable } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { createReportDto } from './dtos/createReportDto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>){}

  create(reportDto: createReportDto) {
    const report = this.repo.create(reportDto)

    return this.repo.save(report)
  }
}
