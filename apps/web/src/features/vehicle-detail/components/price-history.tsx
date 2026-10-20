import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCompactPrice, formatDate, formatPrice } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { ChartTooltip } from '@/shared/ui/charts/chart-tooltip';
import { Skeleton } from '@/shared/ui/feedback';
import { usePriceHistory } from '../use-vehicle';

/** Historial transparente: cada cambio de precio queda registrado. */
export function PriceHistory({ vehicleId }: { vehicleId: string }) {
  const { data, isLoading } = usePriceHistory(vehicleId);
  if (isLoading) return <Skeleton className="h-56" />;
  const points = [...(data ?? [])].reverse().map((p) => ({ date: p.validFrom, amount: p.amount }));
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Historial de precio</h2>
      {points.length < 2 ? (
        <p className="mt-3 text-sm text-fg-muted">
          El precio no ha cambiado desde su publicación
          {points[0] && <> el {formatDate(points[0].date)}</>}.
        </p>
      ) : (
        <div className="mt-4 h-48" role="img" aria-label="Evolución del precio del vehículo">
          <ResponsiveContainer>
            <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--line)" />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: 'var(--fg-muted)' }}
                axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatCompactPrice} width={64} domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: 'var(--fg-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip format={formatPrice} labelFormat={formatDate} />}
                cursor={{ stroke: 'var(--line)' }} />
              <Line type="stepAfter" dataKey="amount" stroke="var(--chart)" strokeWidth={2}
                dot={{ r: 4, fill: 'var(--chart)', stroke: 'var(--surface-raised)', strokeWidth: 2 }}
                activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
