import { Module } from '@nestjs/common';
import { VehiclesModule } from '../vehicles/vehicles.module.js';
import { PRICE_REPOSITORY } from './application/price.repository.js';
import { PricingService } from './application/pricing.service.js';
import { DrizzlePriceRepository } from './infrastructure/drizzle-price.repository.js';
import { PricingController } from './presentation/pricing.controller.js';

@Module({
  imports: [VehiclesModule],
  controllers: [PricingController],
  providers: [PricingService, { provide: PRICE_REPOSITORY, useClass: DrizzlePriceRepository }],
})
export class PricingModule {}
