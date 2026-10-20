import type { LucideIcon } from 'lucide-react';
import { Card } from '@/shared/ui/card';

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}

/** Un número protagonista: no necesita gráfica. */
export function StatTile({ icon: Icon, label, value, hint }: StatTileProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-sm text-fg-muted">
        <Icon className="size-4" aria-hidden /> {label}
      </div>
      <p className="tabular mt-3 font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-fg-muted">{hint}</p>}
    </Card>
  );
}
