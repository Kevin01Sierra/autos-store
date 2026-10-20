import type { MarketInsightDto } from '@autos/contracts';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatNumber } from '@/shared/lib/format';
import { ChartTooltip } from '@/shared/ui/charts/chart-tooltip';

const label = (r: MarketInsightDto) => `${r.brand} ${r.model}${r.color ? ` · ${r.color}` : ''}`;

/** Ranking horizontal de una sola serie: barras delgadas con extremo redondeado. */
export function MarketChart({ rows }: { rows: MarketInsightDto[] }) {
  const data = rows.map((r) => ({ name: label(r), units: r.units }));
  return (
    <div style={{ height: Math.max(220, data.length * 36) }} role="img"
      aria-label="Ranking de modelos más matriculados">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 8 }}>
          <CartesianGrid horizontal={false} stroke="var(--line)" />
          <XAxis type="number" tickFormatter={formatNumber} axisLine={false} tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--fg-muted)' }} />
          <YAxis type="category" dataKey="name" width={190} axisLine={false} tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--fg)' }} />
          <Tooltip cursor={{ fill: 'var(--surface-sunken)' }}
            content={<ChartTooltip format={(v) => `${formatNumber(v)} unidades`} />} />
          <Bar dataKey="units" fill="var(--chart)" barSize={18} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
