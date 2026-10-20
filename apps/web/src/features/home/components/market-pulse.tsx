import { Link } from 'react-router';
import { useMarketTop } from '@/features/market/hooks/use-market';
import { formatNumber } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/feedback';
import { SectionHeader } from '@/shared/ui/section-header';

/** Top 5 del mercado con barras de proporción (una sola serie, un solo color). */
export function MarketPulse() {
  const { data, isLoading } = useMarketTop({ limit: 5 });
  const max = Math.max(1, ...(data ?? []).map((r) => r.units));
  return (
    <section className="container-page pt-20">
      <SectionHeader eyebrow="Mercado" title="Lo más matriculado en Colombia"
        action={<Link to="/mercado" className="text-sm font-medium text-brand-600 hover:underline">Ver análisis completo →</Link>} />
      <Card className="divide-y divide-line">
        {isLoading && <Skeleton className="m-6 h-48" />}
        {data?.map((r, i) => (
          <div key={`${r.brand}${r.model}${r.color}`} className="grid grid-cols-[2rem_1fr_auto] items-center gap-4 px-6 py-4">
            <span className="font-display text-lg text-fg-muted">{i + 1}</span>
            <div>
              <p className="font-medium">{r.brand} {r.model} <span className="text-fg-muted">· {r.color}</span></p>
              <div className="mt-2 h-1.5 rounded-full bg-surface-sunken">
                <div className="h-full rounded-full bg-[var(--chart)]" style={{ width: `${(r.units / max) * 100}%` }} />
              </div>
            </div>
            <span className="tabular text-sm">{formatNumber(r.units)}</span>
          </div>
        ))}
      </Card>
    </section>
  );
}
