import {
  Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  createVehicleSchema, updateVehicleSchema, vehicleFilterSchema,
  type CreateVehicleDto, type UpdateVehicleDto, type VehicleFilter,
} from '@autos/contracts';
import type { AuthUser } from '../../../shared/auth/auth-user.js';
import { Auth, CurrentUser } from '../../../shared/auth/auth.decorators.js';
import { ZodValidationPipe } from '../../../shared/http/zod-validation.pipe.js';
import { VehiclesService } from '../application/vehicles.service.js';

@ApiTags('Vehículos')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicles: VehiclesService) {}

  @Get()
  search(@Query(new ZodValidationPipe(vehicleFilterSchema)) filter: VehicleFilter) {
    return this.vehicles.search({ ...filter, status: 'published' });
  }

  /** Inventario completo para el admin: incluye borradores y archivados. */
  @Get('manage')
  @Auth('admin')
  manage(@Query(new ZodValidationPipe(vehicleFilterSchema)) filter: VehicleFilter) {
    return this.vehicles.search(filter);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehicles.get(id);
  }

  @Post()
  @Auth()
  register(
    @Body(new ZodValidationPipe(createVehicleSchema)) body: CreateVehicleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.vehicles.register(body, user);
  }

  @Patch(':id')
  @Auth('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateVehicleSchema)) body: UpdateVehicleDto,
  ) {
    return this.vehicles.update(id, body);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehicles.remove(id);
  }
}
