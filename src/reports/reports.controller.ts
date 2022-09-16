import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { createReportDto } from './dtos/createReport.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { reportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { approveReportDto } from './dtos/approveReport.dto';
import { AdminGuard } from '../guards/admin.guard';
import { getEstimateDto } from './dtos/getEstimate.dto';
import { query } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService){}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(reportDto)
  createReports(@Body() body: createReportDto, @CurrentUser() user: User){
    return this.reportsService.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch('/:id')
  approveReports(@Param('id') id: string, @Body() body: approveReportDto){
    return this.reportsService.changeApproval(parseInt(id), body.approved)
  }

  @Get()
  getEstimate(@Query() query: getEstimateDto){
    return this.reportsService.createEstimate(query)
  }
}
