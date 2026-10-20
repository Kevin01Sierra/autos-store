import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OrderPlacedEvent, OrderStatusChangedEvent,
} from '../../orders/domain/order.events.js';
import { SALES_STATS_READER, type SalesStatsReader } from './recommendation.ports.js';

/**
 * Observer: reacciona a cada compra recalculando las ventas internas.
 * El módulo de pedidos no sabe que este módulo existe.
 */
@Injectable()
export class SalesStatsListener {
  private readonly logger = new Logger(SalesStatsListener.name);

  constructor(@Inject(SALES_STATS_READER) private readonly sales: SalesStatsReader) {}

  @OnEvent([OrderPlacedEvent.NAME, OrderStatusChangedEvent.NAME], { async: true })
  async onOrderChanged(event: { orderId: string }): Promise<void> {
    try {
      await this.sales.refresh();
    } catch (error) {
      this.logger.error(`No se pudo recalcular ventas tras ${event.orderId}`, error as Error);
    }
  }
}
