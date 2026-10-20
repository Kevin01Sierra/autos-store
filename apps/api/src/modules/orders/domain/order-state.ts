import type { OrderStatus } from '@autos/contracts';
import { BusinessRuleError } from '../../../shared/domain/domain-errors.js';

/**
 * Patrón State: cada estado del pedido decide a qué estados puede pasar.
 * Agregar un estado nuevo no obliga a tocar condicionales repartidos por el código.
 */
abstract class OrderState {
  abstract readonly status: OrderStatus;
  protected abstract readonly next: readonly OrderStatus[];

  transitionTo(target: OrderStatus): OrderState {
    if (!this.next.includes(target)) {
      throw new BusinessRuleError(`Un pedido ${this.status} no puede pasar a ${target}`);
    }
    return OrderStateFactory.of(target);
  }

  get releasesStock(): boolean {
    return false;
  }
}

class PendingState extends OrderState {
  readonly status = 'pending';
  protected readonly next = ['paid', 'cancelled'] as const;
}

class PaidState extends OrderState {
  readonly status = 'paid';
  protected readonly next = ['delivered', 'cancelled'] as const;
}

class DeliveredState extends OrderState {
  readonly status = 'delivered';
  protected readonly next = [] as const;
}

class CancelledState extends OrderState {
  readonly status = 'cancelled';
  protected readonly next = [] as const;
  override get releasesStock(): boolean {
    return true;
  }
}

export class OrderStateFactory {
  private static readonly states: Record<OrderStatus, OrderState> = {
    pending: new PendingState(),
    paid: new PaidState(),
    delivered: new DeliveredState(),
    cancelled: new CancelledState(),
  };

  static of(status: OrderStatus): OrderState {
    return OrderStateFactory.states[status];
  }
}
