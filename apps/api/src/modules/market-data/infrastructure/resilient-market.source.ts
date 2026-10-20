import type { MarketDataSource } from '../application/market-data.ports.js';
import type { MarketRecord } from '../domain/market-record.js';

/**
 * Decorator: envuelve cualquier fuente agregando reintentos con espera exponencial
 * y caché en memoria, sin modificar la fuente original.
 */
export class ResilientMarketSource implements MarketDataSource {
  private cache?: { records: MarketRecord[]; expiresAt: number };

  constructor(
    private readonly inner: MarketDataSource,
    private readonly ttlMs = 60 * 60 * 1000,
    private readonly retries = 3,
  ) {}

  get name(): string {
    return this.inner.name;
  }

  async fetchRecords(): Promise<MarketRecord[]> {
    if (this.cache && this.cache.expiresAt > Date.now()) return this.cache.records;
    const records = await this.withRetry(1);
    this.cache = { records, expiresAt: Date.now() + this.ttlMs };
    return records;
  }

  private async withRetry(attempt: number): Promise<MarketRecord[]> {
    try {
      return await this.inner.fetchRecords();
    } catch (error) {
      if (attempt >= this.retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 250));
      return this.withRetry(attempt + 1);
    }
  }
}
