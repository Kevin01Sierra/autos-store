import { Module } from '@nestjs/common';
import { BRAND_REPOSITORY } from './application/brand.repository.js';
import { BrandsService } from './application/brands.service.js';
import { DrizzleBrandRepository } from './infrastructure/drizzle-brand.repository.js';
import { BrandsController } from './presentation/brands.controller.js';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService, { provide: BRAND_REPOSITORY, useClass: DrizzleBrandRepository }],
  exports: [BrandsService],
})
export class BrandsModule {}
