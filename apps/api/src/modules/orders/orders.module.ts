import { Module } from '@nestjs/common';
import { VehiclesModule } from '../vehicles/vehicles.module.js';
import { ORDER_REPOSITORY } from './application/order.repository.js';
import { OrdersService } from './application/orders.service.js';
import { PurchaseFacade } from './application/purchase.facade.js';
import { DrizzleOrderRepository } from './infrastructure/drizzle-order.repository.js';
import { OrdersController } from './presentation/orders.controller.js';

@Module({
  imports: [VehiclesModule],
  controllers: [OrdersController],
  providers: [
    PurchaseFacade,
    OrdersService,
    { provide: ORDER_REPOSITORY, useClass: DrizzleOrderRepository },
  ],
})
export class OrdersModule {}
