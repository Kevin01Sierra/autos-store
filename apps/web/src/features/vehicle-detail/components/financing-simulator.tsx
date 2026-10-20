import { useState } from 'react';
import { formatPrice } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';

/** Tasa mensual de referencia para la simulación; no es una oferta de crédito. */
const MONTHLY_RATE = 0.0145;
const TERMS = [24, 36, 48, 60, 72];

export const monthlyPayment = (principal: number, months: number, rate = MONTHLY_RATE): number =>
  principal <= 0 ? 0 : (principal * rate) / (1 - (1 + rate) ** -months);

export function FinancingSimulator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(30);
  const [months, setMonths] = useState(60);
  const principal = price * (1 - downPct / 100);
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Simula tu financiación</h2>
      <label className="mt-5 block text-sm">
        Cuota inicial: <strong className="tabular">{downPct}% · {formatPrice(price * (downPct / 100))}</strong>
        <input type="range" min={10} max={80} step={5} value={downPct} className="mt-2 w-full accent-brand-500"
          onChange={(e) => setDownPct(Number(e.target.value))} />
      </label>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Plazo en meses">
        {TERMS.map((term) => (
          <button key={term} type="button" onClick={() => setMonths(term)} aria-pressed={months === term}
            className={`rounded-full border px-3 py-1.5 text-sm ${months === term ? 'border-brand-500 bg-brand-500 text-white' : 'border-line'}`}>
            {term} meses
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-fg-muted">Cuota mensual estimada</p>
      <p className="tabular font-display text-2xl font-semibold">{formatPrice(monthlyPayment(principal, months))}</p>
      <p className="mt-2 text-xs text-fg-muted">
        Referencia con tasa de {(MONTHLY_RATE * 100).toFixed(2)}% mensual. Sujeto a estudio de crédito.
      </p>
    </Card>
  );
}
