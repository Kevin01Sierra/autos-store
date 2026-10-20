import type { RecommendationDto } from '@autos/contracts';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { formatPrice } from '@/shared/lib/format';
import { CarIllustration } from '@/shared/ui/car-illustration';

/** Recomendación explicable: muestra el puntaje y por qué se recomienda. */
export function RecommendationCard({ item, rank }: { item: RecommendationDto; rank: number }) {
  const v = item.vehicle;
  const match = Math.round(item.score * 100);
  return (
    <article className="relative grid gap-4 rounded-card border border-line bg-surface-raised p-5 shadow-card sm:grid-cols-[200px_1fr]">
      <div className="rounded-2xl bg-surface-sunken p-3">
        <CarIllustration bodyType={v.bodyType} color={v.colorHex} label={`${v.modelName} ${v.colorName}`} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">
            <span className="mr-2 text-fg-muted">#{rank}</span>
            <Link to={`/autos/${v.id}`} className="after:absolute after:inset-0">{v.brandName} {v.modelName}</Link>
          </h3>
          <span className="tabular text-sm font-semibold text-brand-600">{match}% afinidad</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-sunken" aria-hidden>
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(match, 4)}%` }} />
        </div>
        <ul className="mt-1 space-y-1 text-sm text-fg-muted">
          {item.reasons.map((reason) => (
            <li key={reason} className="flex gap-2"><Sparkles className="mt-0.5 size-3.5 shrink-0 text-brand-500" />{reason}</li>
          ))}
        </ul>
        <p className="tabular mt-auto pt-2 font-semibold">{formatPrice(v.price)} · {v.colorName} · {v.year}</p>
      </div>
    </article>
  );
}
