import { describe, expect, it } from 'vitest';
import { createPurchaseChain } from '../../src/modules/orders/application/purchase-chain.factory.js';
import { aCustomer, aVehicle } from '../support/vehicle.fixture.js';

const validate = (vehicle = aVehicle(), quantity = 1, customer = aCustomer) =>
  createPurchaseChain().validate({ customer, lines: [{ vehicle, quantity }] });

describe('Cadena de validación de compra', () => {
  it('acepta una compra válida', () => {
    expect(() => validate()).not.toThrow();
  });

  it('rechaza vehículos no publicados', () => {
    expect(() => validate(aVehicle({ status: 'draft' }))).toThrow('no está a la venta');
  });

  it('rechaza comprar un vehículo propio', () => {
    expect(() => validate(aVehicle({ sellerId: aCustomer.id }))).toThrow('tú publicaste');
  });

  it('rechaza vehículos sin precio', () => {
    expect(() => validate(aVehicle({ price: 0 }))).toThrow('no tiene precio');
  });

  it('rechaza cantidades mayores al stock', () => {
    expect(() => validate(aVehicle({ stock: 1 }), 2)).toThrow('Stock insuficiente');
  });

  it('rechaza más de 5 unidades en total', () => {
    expect(() => validate(aVehicle({ stock: 10 }), 6)).toThrow('Máximo 5');
  });
});
