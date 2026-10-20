import { describe, expect, it } from 'vitest';
import { OrderStateFactory } from '../../src/modules/orders/domain/order-state.js';

describe('OrderState', () => {
  it('permite el flujo pendiente -> pagado -> entregado', () => {
    const delivered = OrderStateFactory.of('pending').transitionTo('paid').transitionTo('delivered');
    expect(delivered.status).toBe('delivered');
  });

  it('rechaza transiciones inválidas', () => {
    expect(() => OrderStateFactory.of('delivered').transitionTo('cancelled')).toThrow(
      'no puede pasar a cancelled',
    );
    expect(() => OrderStateFactory.of('pending').transitionTo('delivered')).toThrow();
  });

  it('solo la cancelación libera stock', () => {
    expect(OrderStateFactory.of('pending').transitionTo('cancelled').releasesStock).toBe(true);
    expect(OrderStateFactory.of('pending').transitionTo('paid').releasesStock).toBe(false);
  });
});
