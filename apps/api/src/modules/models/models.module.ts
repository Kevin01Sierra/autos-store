import { Module } from '@nestjs/common';
import { BrandsModule } from '../brands/brands.module.js';
import { MODEL_REPOSITORY } from './application/model.repository.js';
import { ModelsService } from './application/models.service.js';
import { DrizzleModelRepository } from './infrastructure/drizzle-model.repository.js';
import { ModelsController } from './presentation/models.controller.js';

@Module({
  imports: [BrandsModule],
  controllers: [ModelsController],
  providers: [ModelsService, { provide: MODEL_REPOSITORY, useClass: DrizzleModelRepository }],
  exports: [ModelsService],
})
export class ModelsModule {}
