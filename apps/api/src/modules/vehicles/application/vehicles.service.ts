import { Inject, Injectable } from '@nestjs/common';
import type { CreateVehicleDto, UpdateVehicleDto, VehicleDto, VehicleFilter } from '@autos/contracts';
import type { AuthUser } from '../../../shared/auth/auth-user.js';
import { NotFoundError } from '../../../shared/domain/domain-errors.js';
import { ColorsService } from '../../colors/application/colors.service.js';
import { ModelsService } from '../../models/application/models.service.js';
import { Stock } from '../domain/stock.js';
import { VEHICLE_REPOSITORY, type VehicleRepository } from './vehicle.repository.js';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(VEHICLE_REPOSITORY) private readonly vehicles: VehicleRepository,
    private readonly models: ModelsService,
    private readonly colors: ColorsService,
  ) {}

  search(filter: VehicleFilter) {
    return this.vehicles.search(filter);
  }

  async get(id: string): Promise<VehicleDto> {
    const vehicle = await this.vehicles.findById(id);
    if (!vehicle) throw new NotFoundError('Vehículo', id);
    return vehicle;
  }

  /** Un cliente puede publicar su auto, pero queda en borrador hasta que un admin lo apruebe. */
  async register(input: CreateVehicleDto, user: AuthUser): Promise<VehicleDto> {
    await Promise.all([this.models.get(input.modelId), this.colors.get(input.colorId)]);
    Stock.of(input.stock);
    const status = user.role === 'admin' ? input.status : 'draft';
    return this.vehicles.create({ ...input, status, sellerId: user.id });
  }

  async update(id: string, input: UpdateVehicleDto): Promise<VehicleDto> {
    if (input.stock !== undefined) Stock.of(input.stock);
    const vehicle = await this.vehicles.update(id, input);
    if (!vehicle) throw new NotFoundError('Vehículo', id);
    return vehicle;
  }

  async remove(id: string): Promise<void> {
    if (!(await this.vehicles.remove(id))) throw new NotFoundError('Vehículo', id);
  }
}
