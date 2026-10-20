import type { MarketInsightDto } from '@autos/contracts';
import { formatNumber } from '@/shared/lib/format';

export function MarketTable({ rows }: { rows: MarketInsightDto[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-fg-muted">
          <tr>
            {['#', 'Marca', 'Modelo', 'Color', 'Unidades', 'Periodo'].map((h) => (
              <th key={h} className="border-b border-line px-3 py-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.brand}-${r.model}-${r.color}-${r.source}`} className="border-b border-line/60">
              <td className="px-3 py-2 text-fg-muted">{i + 1}</td>
              <td className="px-3 py-2">{r.brand}</td>
              <td className="px-3 py-2 font-medium">{r.model}</td>
              <td className="px-3 py-2">{r.color ?? '—'}</td>
              <td className="tabular px-3 py-2">{formatNumber(r.units)}</td>
              <td className="px-3 py-2 text-fg-muted">{r.period.slice(0, 7)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
