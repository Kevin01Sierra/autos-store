import { describe, expect, it, vi } from 'vitest';
import type { OrderStatus } from '@autos/contracts';
import { OrdersService } from '../../src/modules/orders/application/orders.service.js';
import { OrderStatusChangedEvent } from '../../src/modules/orders/domain/order.events.js';
import { aCustomer } from '../support/vehicle.fixture.js';

const anAdmin = { id: 'admin-1', role: 'admin' as const };

function setup(status: OrderStatus = 'pending', customerId = aCustomer.id) {
  const order = { id: 'order-1', customerId, status, total: 1, createdAt: '', items: [] };
  const orders = {
    findById: vi.fn().mockResolvedValue(order),
    changeStatus: vi.fn().mockResolvedValue(order),
  };
  const events = { emit: vi.fn() };
  // Los dobles solo implementan lo que usa el servicio.
  const service = new OrdersService(orders as never, events as never);
  return { service, orders, events };
}

describe('OrdersService.changeStatus', () => {
  it('el cliente cancela su pedido pendiente y se libera el stock', async () => {
    const { service, orders, events } = setup();
    await service.changeStatus('order-1', 'cancelled', aCustomer);
    expect(orders.changeStatus).toHaveBeenCalledWith('order-1', {
      from: 'pending', to: 'cancelled', releaseStock: true,
    });
    expect(events.emit).toHaveBeenCalledWith(OrderStatusChangedEvent.NAME, expect.anything());
  });

  it('el cliente no puede marcar su pedido como pagado', async () => {
    const { service, orders } = setup();
    await expect(service.changeStatus('order-1', 'paid', aCustomer)).rejects.toThrow('Solo puedes cancelar');
    expect(orders.changeStatus).not.toHaveBeenCalled();
  });

  it('el cliente no puede tocar pedidos de otra persona', async () => {
    const { service, orders } = setup('pending', 'otra-persona');
    await expect(service.changeStatus('order-1', 'cancelled', aCustomer)).rejects.toThrow('no es tuyo');
    expect(orders.changeStatus).not.toHaveBeenCalled();
  });

  it('el admin marca un pedido como pagado sin liberar stock', async () => {
    const { service, orders } = setup('pending', 'otra-persona');
    await service.changeStatus('order-1', 'paid', anAdmin);
    expect(orders.changeStatus).toHaveBeenCalledWith('order-1', {
      from: 'pending', to: 'paid', releaseStock: false,
    });
  });
});
