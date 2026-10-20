import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MarketDataSource } from '../application/market-data.ports.js';
import { monthStart, normalizeName, type MarketRecord } from '../domain/market-record.js';

type SocrataRow = Record<string, unknown>;

/**
 * Adapter: traduce un conjunto de datos abierto de Socrata (datos.gov.co, RUNT)
 * al formato MarketRecord. Las columnas se configuran por variables de entorno
 * porque cada conjunto de datos usa nombres distintos.
 */
@Injectable()
export class SocrataMarketSource implements MarketDataSource {
  readonly name = 'datos.gov.co';

  constructor(private readonly config: ConfigService) {}

  async fetchRecords(): Promise<MarketRecord[]> {
    const url = this.config.get<string>('MARKET_DATASET_URL');
    if (!url) return [];
    const response = await fetch(this.buildQuery(url));
    if (!response.ok) throw new Error(`Socrata respondió ${response.status}`);
    const rows = (await response.json()) as SocrataRow[];
    return rows.map((row) => this.toRecord(row)).filter((r): r is MarketRecord => r !== null);
  }

  private buildQuery(url: string): string {
    const [brand, model, color, period] = this.fields();
    const query = new URLSearchParams({
      $select: `${brand},${model},${color},date_trunc_ym(${period}) as period,count(*) as units`,
      $group: `${brand},${model},${color},period`,
      $order: 'units DESC',
      $limit: '5000',
    });
    return `${url}?${query.toString()}`;
  }

  private toRecord(row: SocrataRow): MarketRecord | null {
    const [brandField, modelField, colorField] = this.fields();
    const brand = normalizeName(row[brandField]);
    const model = normalizeName(row[modelField]);
    const period = monthStart(row['period']);
    if (!brand || !model || !period) return null;
    const color = normalizeName(row[colorField]);
    return { brand, model, color, period, units: Number(row['units']) || 0, source: this.name };
  }

  private fields(): [string, string, string, string] {
    const get = (key: string) => this.config.getOrThrow<string>(key);
    return [get('MARKET_FIELD_BRAND'), get('MARKET_FIELD_MODEL'),
      get('MARKET_FIELD_COLOR'), get('MARKET_FIELD_PERIOD')];
  }
}
