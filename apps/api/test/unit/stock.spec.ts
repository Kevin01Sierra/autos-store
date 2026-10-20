import { describe, expect, it } from 'vitest';
import { BusinessRuleError } from '../../src/shared/domain/domain-errors.js';
import { Stock } from '../../src/modules/vehicles/domain/stock.js';

describe('Stock', () => {
  it('no acepta valores negativos ni decimales', () => {
    expect(() => Stock.of(-1)).toThrow(BusinessRuleError);
    expect(() => Stock.of(1.5)).toThrow(BusinessRuleError);
  });

  it('reserva unidades sin mutar el valor original', () => {
    const stock = Stock.of(3);
    expect(stock.reserve(2).units).toBe(1);
    expect(stock.units).toBe(3);
  });

  it('impide reservar más de lo disponible', () => {
    expect(() => Stock.of(1).reserve(2)).toThrow('Stock insuficiente');
    expect(Stock.of(1).canReserve(0)).toBe(false);
  });
});
