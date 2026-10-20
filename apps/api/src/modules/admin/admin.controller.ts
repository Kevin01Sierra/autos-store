import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../shared/auth/auth.decorators.js';
import { AdminMetricsQuery } from './admin-metrics.query.js';

@ApiTags('Administración')
@Controller('admin')
@Auth('admin')
export class AdminController {
  constructor(private readonly metrics: AdminMetricsQuery) {}

  @Get('metrics')
  getMetrics() {
    return this.metrics.execute();
  }
}
