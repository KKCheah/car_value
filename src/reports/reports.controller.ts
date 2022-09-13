import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { createReportDto } from './dtos/createReportDto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService){}

  @Post()
  @UseGuards(AuthGuard)
  createReports(@Body() body: createReportDto){
    return this.reportsService.create(body);
  }
}
