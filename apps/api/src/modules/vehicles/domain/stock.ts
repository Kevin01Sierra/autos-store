import { BusinessRuleError } from '../../../shared/domain/domain-errors.js';

/** Value Object: cantidad disponible de un vehículo. Nunca puede quedar negativa. */
export class Stock {
  private constructor(readonly units: number) {}

  static of(units: number): Stock {
    if (!Number.isInteger(units) || units < 0) {
      throw new BusinessRuleError('El stock debe ser un entero mayor o igual a 0');
    }
    return new Stock(units);
  }

  canReserve(quantity: number): boolean {
    return quantity > 0 && quantity <= this.units;
  }

  reserve(quantity: number): Stock {
    if (!this.canReserve(quantity)) {
      throw new BusinessRuleError(`Stock insuficiente: quedan ${this.units} unidades`);
    }
    return new Stock(this.units - quantity);
  }

  adjust(delta: number): Stock {
    return Stock.of(this.units + delta);
  }
}
