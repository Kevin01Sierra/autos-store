import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { OrderDto, OrderStatus } from '@autos/contracts';
import type { AuthUser } from '../../../shared/auth/auth-user.js';
import { ForbiddenError, NotFoundError } from '../../../shared/domain/domain-errors.js';
import { OrderStatusChangedEvent } from '../domain/order.events.js';
import { OrderStateFactory } from '../domain/order-state.js';
import { ORDER_REPOSITORY, type OrderRepository } from './order.repository.js';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    private readonly events: EventEmitter2,
  ) {}

  list(user: AuthUser): Promise<OrderDto[]> {
    return user.role === 'admin' ? this.orders.findAll() : this.orders.findByCustomer(user.id);
  }

  async get(id: string, user: AuthUser): Promise<OrderDto> {
    const order = await this.orders.findById(id);
    if (!order) throw new NotFoundError('Pedido', id);
    if (user.role !== 'admin' && order.customerId !== user.id) {
      throw new ForbiddenError('Este pedido no es tuyo');
    }
    return order;
  }

  /** El cliente solo puede cancelar; el admin mueve el pedido por todo su ciclo de vida. */
  async changeStatus(id: string, target: OrderStatus, user: AuthUser): Promise<OrderDto> {
    const order = await this.get(id, user);
    if (user.role !== 'admin' && target !== 'cancelled') {
      throw new ForbiddenError('Solo puedes cancelar tus pedidos');
    }
    const next = OrderStateFactory.of(order.status).transitionTo(target);
    const updated = await this.orders.changeStatus(id, {
      from: order.status, to: next.status, releaseStock: next.releasesStock,
    });
    this.events.emit(OrderStatusChangedEvent.NAME, new OrderStatusChangedEvent(id, next.status));
    return updated;
  }
}
