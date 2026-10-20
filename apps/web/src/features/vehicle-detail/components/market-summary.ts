import type { MarketInsightDto, VehicleDto } from '@autos/contracts';

export interface MarketSummary {
  units: number;
  colorUnits?: number;
  ranking: number;
  source: string;
}

const same = (a?: string | null, b?: string) => a?.toLowerCase() === b?.toLowerCase();

/** Resume la popularidad de un modelo (y su color) dentro del ranking de mercado. */
export function summarizeModel(rows: MarketInsightDto[], vehicle: VehicleDto): MarketSummary | null {
  const sameModel = rows.filter((r) => same(r.model, vehicle.modelName));
  const first = sameModel[0];
  if (!first) return null;
  const models = [...new Set(rows.map((r) => r.model))];
  return {
    units: sameModel.reduce((sum, r) => sum + r.units, 0),
    colorUnits: sameModel.find((r) => same(r.color, vehicle.colorName))?.units,
    ranking: models.indexOf(first.model) + 1,
    source: first.source === 'demo' ? 'datos de demostración' : first.source,
  };
}
