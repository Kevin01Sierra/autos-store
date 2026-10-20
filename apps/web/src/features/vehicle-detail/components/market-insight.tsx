import type { VehicleDto } from '@autos/contracts';
import { TrendingUp } from 'lucide-react';
import { useMarketTop } from '@/features/market/hooks/use-market';
import { formatNumber } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { summarizeModel } from './market-summary';

/** Muestra qué tan popular es el modelo en el mercado real (matrículas). */
export function MarketInsight({ vehicle }: { vehicle: VehicleDto }) {
  const { data = [] } = useMarketTop({ limit: 50 });
  const summary = summarizeModel(data, vehicle);
  if (!summary) return null;
  const title = summary.ranking <= 10 ? `Top ${summary.ranking} del mercado` : 'Modelo con demanda real';
  return (
    <Card className="flex gap-4 p-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 dark:bg-brand-500/15">
        <TrendingUp className="size-5 text-brand-600" aria-hidden />
      </span>
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-fg-muted">
          {formatNumber(summary.units)} unidades de {vehicle.modelName} matriculadas en el último periodo
          {summary.colorUnits && <>, {formatNumber(summary.colorUnits)} en color {vehicle.colorName.toLowerCase()}</>}.
        </p>
        <p className="mt-2 text-xs text-fg-muted">Fuente: {summary.source}</p>
      </div>
    </Card>
  );
}
