import { Module } from '@nestjs/common';
import { COLOR_REPOSITORY } from './application/color.repository.js';
import { ColorsService } from './application/colors.service.js';
import { DrizzleColorRepository } from './infrastructure/drizzle-color.repository.js';
import { ColorsController } from './presentation/colors.controller.js';

@Module({
  controllers: [ColorsController],
  providers: [ColorsService, { provide: COLOR_REPOSITORY, useClass: DrizzleColorRepository }],
  exports: [ColorsService],
})
export class ColorsModule {}
