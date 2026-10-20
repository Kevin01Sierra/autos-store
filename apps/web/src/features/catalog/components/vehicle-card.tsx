import type { VehicleDto } from '@autos/contracts';
import { GitCompareArrows } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useCompare } from '@/features/compare/compare-store';
import { cn } from '@/shared/lib/cn';
import { formatKm, formatPrice } from '@/shared/lib/format';
import { TRANSMISSION_LABELS } from '@/shared/lib/labels';
import { Badge } from '@/shared/ui/badge';
import { CarIllustration } from '@/shared/ui/car-illustration';
import { ColorDot } from '@/shared/ui/color-dot';

interface VehicleCardProps {
  vehicle: VehicleDto;
  highlight?: string;
}

export function VehicleCard({ vehicle: v, highlight }: VehicleCardProps) {
  const compare = useCompare();
  const name = `${v.brandName} ${v.modelName}`;
  return (
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface-raised shadow-card transition-shadow hover:shadow-lift">
      <div className="relative bg-gradient-to-b from-surface-sunken to-surface-raised px-6 pt-8 pb-2">
        {highlight && <Badge tone="brand" className="absolute top-3 left-3">{highlight}</Badge>}
        {v.stock <= 2 && <Badge tone="warning" className="absolute top-3 right-3">Últimas {v.stock}</Badge>}
        <CarIllustration bodyType={v.bodyType} color={v.colorHex} label={`${name} color ${v.colorName}`}
          className="transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs text-fg-muted">{v.year} · {formatKm(v.mileageKm)} · {TRANSMISSION_LABELS[v.transmission]}</p>
          <h3 className="mt-1 text-lg font-semibold">
            <Link to={`/autos/${v.id}`} className="after:absolute after:inset-0">{name}</Link>
          </h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-fg-muted">
            <ColorDot hex={v.colorHex} /> {v.colorName}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <p className="tabular text-xl font-semibold">{formatPrice(v.price)}</p>
          <button type="button" onClick={() => compare.toggle(v.id)} aria-pressed={compare.has(v.id)}
            className={cn('relative z-10 flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors',
              compare.has(v.id) ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15' : 'border-line hover:border-fg/30')}>
            <GitCompareArrows className="size-3.5" /> Comparar
          </button>
        </div>
      </div>
    </motion.article>
  );
}
