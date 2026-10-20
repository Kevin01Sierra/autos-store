import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { ORDER_REPOSITORY } from '../../src/modules/orders/application/order.repository.js';
import { PurchaseFacade } from '../../src/modules/orders/application/purchase.facade.js';
import { OrderPlacedEvent } from '../../src/modules/orders/domain/order.events.js';
import { VehiclesService } from '../../src/modules/vehicles/application/vehicles.service.js';
import { aCustomer, aVehicle } from '../support/vehicle.fixture.js';

async function setup(vehicle = aVehicle()) {
  const order = { id: 'order-1', items: [{ vehicleId: vehicle.id, quantity: 1, unitPrice: 1 }] };
  const orders = { place: vi.fn().mockResolvedValue(order) };
  const events = { emit: vi.fn() };
  const module = await Test.createTestingModule({
    providers: [
      PurchaseFacade,
      { provide: VehiclesService, useValue: { get: vi.fn().mockResolvedValue(vehicle) } },
      { provide: ORDER_REPOSITORY, useValue: orders },
      { provide: EventEmitter2, useValue: events },
    ],
  }).compile();
  return { facade: module.get(PurchaseFacade), orders, events };
}

describe('PurchaseFacade', () => {
  const input = { items: [{ vehicleId: aVehicle().id, quantity: 1 }] };

  it('valida, registra el pedido con el precio vigente y publica el evento', async () => {
    const { facade, orders, events } = await setup();
    await facade.purchase(input, aCustomer);
    expect(orders.place).toHaveBeenCalledWith(aCustomer.id, [
      { vehicleId: aVehicle().id, quantity: 1, unitPrice: aVehicle().price },
    ]);
    expect(events.emit).toHaveBeenCalledWith(OrderPlacedEvent.NAME, expect.any(OrderPlacedEvent));
  });

  it('no registra nada si una validación falla', async () => {
    const { facade, orders, events } = await setup(aVehicle({ stock: 0 }));
    await expect(facade.purchase(input, aCustomer)).rejects.toThrow('Stock insuficiente');
    expect(orders.place).not.toHaveBeenCalled();
    expect(events.emit).not.toHaveBeenCalled();
  });
});
