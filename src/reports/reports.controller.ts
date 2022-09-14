import { Controller, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { createReportDto } from './dtos/createReport.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { reportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { approveReportDto } from './dtos/approveReport.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService){}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(reportDto)
  createReports(@Body() body: createReportDto, @CurrentUser() user: User){
    return this.reportsService.create(body, user);
  }

  @Patch(':/id')
  approveReports(@Param('id') id: number, @Body() body: approveReportDto){}

}
