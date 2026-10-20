import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { OrderDto, PurchaseDto } from '@autos/contracts';
import type { AuthUser } from '../../../shared/auth/auth-user.js';
import { VehiclesService } from '../../vehicles/application/vehicles.service.js';
import { OrderPlacedEvent } from '../domain/order.events.js';
import type { PurchaseContext } from '../domain/validation/purchase-context.js';
import { ORDER_REPOSITORY, type OrderRepository } from './order.repository.js';
import { createPurchaseChain } from './purchase-chain.factory.js';

/**
 * Facade: un único punto de entrada para comprar. Oculta la carga de vehículos,
 * las validaciones, la transacción y la publicación del evento.
 */
@Injectable()
export class PurchaseFacade {
  private readonly validator = createPurchaseChain();

  constructor(
    private readonly vehicles: VehiclesService,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    private readonly events: EventEmitter2,
  ) {}

  async purchase(input: PurchaseDto, customer: AuthUser): Promise<OrderDto> {
    const context = await this.buildContext(input, customer);
    this.validator.validate(context);
    const order = await this.orders.place(
      customer.id,
      context.lines.map(({ vehicle, quantity }) => ({
        vehicleId: vehicle.id,
        quantity,
        unitPrice: vehicle.price,
      })),
    );
    const vehicleIds = order.items.map((item) => item.vehicleId);
    this.events.emit(OrderPlacedEvent.NAME, new OrderPlacedEvent(order.id, customer.id, vehicleIds));
    return order;
  }

  private async buildContext(input: PurchaseDto, customer: AuthUser): Promise<PurchaseContext> {
    const lines = await Promise.all(
      input.items.map(async (item) => ({
        vehicle: await this.vehicles.get(item.vehicleId),
        quantity: item.quantity,
      })),
    );
    return { customer, lines };
  }
}
