import { Module } from '@nestjs/common';
import { AdminMetricsQuery } from './admin-metrics.query.js';
import { AdminController } from './admin.controller.js';

@Module({ controllers: [AdminController], providers: [AdminMetricsQuery] })
export class AdminModule {}
