/** Evento de dominio publicado tras una compra exitosa (patrón Observer). */
export class OrderPlacedEvent {
  static readonly NAME = 'order.placed';

  constructor(
    readonly orderId: string,
    readonly customerId: string,
    readonly vehicleIds: string[],
  ) {}
}

/** Evento publicado cuando un pedido cambia de estado (p. ej. una cancelación libera stock). */
export class OrderStatusChangedEvent {
  static readonly NAME = 'order.status-changed';

  constructor(
    readonly orderId: string,
    readonly status: string,
  ) {}
}
