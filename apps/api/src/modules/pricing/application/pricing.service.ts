import { Inject, Injectable } from '@nestjs/common';
import type { PriceDto, SetPriceDto } from '@autos/contracts';
import { BusinessRuleError } from '../../../shared/domain/domain-errors.js';
import { VehiclesService } from '../../vehicles/application/vehicles.service.js';
import { PRICE_REPOSITORY, type PriceRepository } from './price.repository.js';

@Injectable()
export class PricingService {
  constructor(
    @Inject(PRICE_REPOSITORY) private readonly prices: PriceRepository,
    private readonly vehicles: VehiclesService,
  ) {}

  async history(vehicleId: string): Promise<PriceDto[]> {
    await this.vehicles.get(vehicleId);
    return this.prices.history(vehicleId);
  }

  async setPrice(vehicleId: string, input: SetPriceDto): Promise<PriceDto> {
    await this.vehicles.get(vehicleId);
    return this.prices.replaceCurrent(vehicleId, input.amount);
  }

  /** Solo se pueden borrar precios históricos; el vigente se reemplaza con setPrice. */
  async removeHistorical(priceId: string): Promise<void> {
    if (!(await this.prices.removeHistorical(priceId))) {
      throw new BusinessRuleError('El precio no existe o es el vigente');
    }
  }
}
