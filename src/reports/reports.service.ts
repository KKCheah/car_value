import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { createReportDto } from './dtos/createReport.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>){}

  create(reportDto: createReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report)
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({id});
    if (!report) {
      throw new NotFoundException('report not found')
    }

    report.approved = approved;
    return this.repo.save(report)
  }
}
