import { BusinessRuleError } from '../../../../shared/domain/domain-errors.js';
import { Stock } from '../../../vehicles/domain/stock.js';
import type { PurchaseContext } from './purchase-context.js';
import { PurchaseValidator } from './purchase-validator.js';

export class PublishedVehicleValidator extends PurchaseValidator {
  protected check({ lines }: PurchaseContext): void {
    const hidden = lines.find((l) => l.vehicle.status !== 'published');
    if (hidden) throw new BusinessRuleError(`${hidden.vehicle.modelName} no está a la venta`);
  }
}

export class OwnVehicleValidator extends PurchaseValidator {
  protected check({ customer, lines }: PurchaseContext): void {
    if (lines.some((l) => l.vehicle.sellerId === customer.id)) {
      throw new BusinessRuleError('No puedes comprar un vehículo que tú publicaste');
    }
  }
}

export class StockAvailableValidator extends PurchaseValidator {
  protected check({ lines }: PurchaseContext): void {
    lines.forEach((l) => Stock.of(l.vehicle.stock).reserve(l.quantity));
  }
}

export class CurrentPriceValidator extends PurchaseValidator {
  protected check({ lines }: PurchaseContext): void {
    const unpriced = lines.find((l) => l.vehicle.price <= 0);
    if (unpriced) throw new BusinessRuleError(`${unpriced.vehicle.modelName} no tiene precio`);
  }
}

export class QuantityLimitValidator extends PurchaseValidator {
  constructor(private readonly maxUnits: number) {
    super();
  }

  protected check({ lines }: PurchaseContext): void {
    const units = lines.reduce((sum, l) => sum + l.quantity, 0);
    if (units > this.maxUnits) {
      throw new BusinessRuleError(`Máximo ${this.maxUnits} vehículos por compra`);
    }
  }
}
