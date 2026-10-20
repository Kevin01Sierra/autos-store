import { Module } from '@nestjs/common';
import { ColorsModule } from '../colors/colors.module.js';
import { ModelsModule } from '../models/models.module.js';
import { VEHICLE_REPOSITORY } from './application/vehicle.repository.js';
import { VehiclesService } from './application/vehicles.service.js';
import { DrizzleVehicleRepository } from './infrastructure/drizzle-vehicle.repository.js';
import { VehiclesController } from './presentation/vehicles.controller.js';

@Module({
  imports: [ModelsModule, ColorsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService, { provide: VEHICLE_REPOSITORY, useClass: DrizzleVehicleRepository }],
  exports: [VehiclesService, VEHICLE_REPOSITORY],
})
export class VehiclesModule {}
