import { formatPrice } from '@/shared/lib/format';
import type { StepProps } from './vehicle-step';

const MIN = 50_000_000;
const MAX = 250_000_000;

/** Paso 3: presupuesto máximo. */
export function BudgetStep({ value, onChange }: StepProps) {
  const budget = value.maxBudget ?? MAX;
  return (
    <div className="space-y-4">
      <p className="tabular font-display text-4xl font-semibold">
        {value.maxBudget ? `Hasta ${formatPrice(budget)}` : 'Sin límite'}
      </p>
      <input type="range" min={MIN} max={MAX} step={5_000_000} value={budget}
        aria-label="Presupuesto máximo" className="w-full accent-brand-500"
        onChange={(e) => {
          const amount = Number(e.target.value);
          onChange({ ...value, maxBudget: amount >= MAX ? undefined : amount });
        }} />
      <div className="flex justify-between text-xs text-fg-muted">
        <span>{formatPrice(MIN)}</span>
        <span>Sin límite</span>
      </div>
    </div>
  );
}
