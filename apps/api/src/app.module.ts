import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { validateEnv } from './config/env.schema.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { BrandsModule } from './modules/brands/brands.module.js';
import { ColorsModule } from './modules/colors/colors.module.js';
import { HealthController } from './modules/health/health.controller.js';
import { MarketDataModule } from './modules/market-data/market-data.module.js';
import { ModelsModule } from './modules/models/models.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { PricingModule } from './modules/pricing/pricing.module.js';
import { RecommendationsModule } from './modules/recommendations/recommendations.module.js';
import { VehiclesModule } from './modules/vehicles/vehicles.module.js';
import { AuthModule } from './shared/auth/auth.module.js';
import { DatabaseModule } from './shared/database/database.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AuthModule,
    BrandsModule,
    ModelsModule,
    ColorsModule,
    VehiclesModule,
    PricingModule,
    OrdersModule,
    MarketDataModule,
    RecommendationsModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
