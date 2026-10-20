import { BarChart3, Table2 } from 'lucide-react';
import { useState } from 'react';
import { useBrands, useColors } from '@/shared/hooks/use-catalog';
import { Button } from '@/shared/ui/button';
import { Select } from '@/shared/ui/field';
import { MarketResults } from './components/market-results';
import { useMarketTop } from './hooks/use-market';

export default function MarketPage() {
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const brands = (useBrands().data ?? []).map((b) => ({ value: b.name, label: b.name }));
  const colors = (useColors().data ?? []).map((c) => ({ value: c.name, label: c.name }));
  const result = useMarketTop({ brand: brand || undefined, color: color || undefined, limit: 12 });
  const viewButton = (value: typeof view, label: string, Icon: typeof BarChart3) => (
    <Button size="icon" variant={view === value ? 'dark' : 'ghost'} onClick={() => setView(value)} aria-label={label}>
      <Icon className="size-4" />
    </Button>
  );
  return (
    <div className="container-page pt-10">
      <h1 className="text-3xl font-semibold sm:text-4xl">Pulso del mercado</h1>
      <p className="mt-2 max-w-2xl text-fg-muted">
        Los modelos más matriculados en Colombia según datos abiertos del RUNT. Úsalo para comparar
        con lo que tienes en mente.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Select className="w-48" options={brands} placeholder="Todas las marcas" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <Select className="w-44" options={colors} placeholder="Todos los colores" value={color} onChange={(e) => setColor(e.target.value)} />
        <div className="ml-auto flex gap-1" role="group" aria-label="Vista">
          {viewButton('chart', 'Gráfica', BarChart3)}
          {viewButton('table', 'Tabla', Table2)}
        </div>
      </div>
      <MarketResults data={result.data} loading={result.isLoading} error={result.error} view={view} />
    </div>
  );
}
