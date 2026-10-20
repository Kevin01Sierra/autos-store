import type { PriceDto } from '@autos/contracts';

/** Puerto del historial de precios: cambiar un precio cierra el vigente y abre uno nuevo. */
export interface PriceRepository {
  history(vehicleId: string): Promise<PriceDto[]>;
  replaceCurrent(vehicleId: string, amount: number): Promise<PriceDto>;
  removeHistorical(priceId: string): Promise<boolean>;
}

export const PRICE_REPOSITORY = Symbol('PRICE_REPOSITORY');
