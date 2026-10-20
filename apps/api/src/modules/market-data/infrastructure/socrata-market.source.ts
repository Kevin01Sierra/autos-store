import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MarketDataSource } from '../application/market-data.ports.js';
import { monthStart, normalizeName, type MarketRecord } from '../domain/market-record.js';
import { buildSocrataQuery, type SocrataFields } from './socrata-query.js';

type SocrataRow = Record<string, unknown>;

/**
 * Adapter: traduce un conjunto de datos abierto de Socrata (datos.gov.co) al formato
 * MarketRecord. Las columnas se configuran por variables de entorno porque cada
 * conjunto de datos usa nombres distintos (ver docs/adr/0004-datos-de-mercado.md).
 */
@Injectable()
export class SocrataMarketSource implements MarketDataSource {
  readonly name = 'datos.gov.co';

  constructor(private readonly config: ConfigService) {}

  async fetchRecords(): Promise<MarketRecord[]> {
    const url = this.config.get<string>('MARKET_DATASET_URL');
    if (!url) return [];
    const fields = this.fields();
    const response = await fetch(buildSocrataQuery(url, fields));
    if (!response.ok) throw new Error(`Socrata respondió ${response.status}`);
    const rows = (await response.json()) as SocrataRow[];
    return rows.map((row) => this.toRecord(row, fields)).filter((r): r is MarketRecord => r !== null);
  }

  private toRecord(row: SocrataRow, fields: SocrataFields): MarketRecord | null {
    const brand = normalizeName(row[fields.brand]);
    const model = normalizeName(row[fields.model]);
    const period = monthStart(row['period']);
    if (!brand || !model || !period) return null;
    const color = fields.color ? normalizeName(row[fields.color]) : null;
    return { brand, model, color, period, units: Number(row['units']) || 0, source: this.name };
  }

  private fields(): SocrataFields {
    const read = (key: string) => this.config.get<string>(key) || undefined;
    return {
      brand: this.config.getOrThrow<string>('MARKET_FIELD_BRAND'),
      model: this.config.getOrThrow<string>('MARKET_FIELD_MODEL'),
      color: read('MARKET_FIELD_COLOR'),
      period: this.config.getOrThrow<string>('MARKET_FIELD_PERIOD'),
      periodType: read('MARKET_PERIOD_TYPE') === 'date' ? 'date' : 'year',
      where: read('MARKET_WHERE'),
    };
  }
}
