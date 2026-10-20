import type { OrderDto, OrderStatus } from '@autos/contracts';

export interface NewOrderLine {
  vehicleId: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Puerto de pedidos. `place` y `changeStatus` son unidades de trabajo:
 * el pedido y el movimiento de stock se confirman juntos o no se confirma nada.
 */
export interface OrderRepository {
  place(customerId: string, lines: NewOrderLine[]): Promise<OrderDto>;
  findById(id: string): Promise<OrderDto | null>;
  findByCustomer(customerId: string): Promise<OrderDto[]>;
  findAll(): Promise<OrderDto[]>;
  changeStatus(id: string, status: OrderStatus, releaseStock: boolean): Promise<OrderDto>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
