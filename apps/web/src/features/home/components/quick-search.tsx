import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toQueryString } from '@/shared/api/http-client';
import { useCatalogOptions } from '@/shared/hooks/use-catalog';
import { Button } from '@/shared/ui/button';
import { Select } from '@/shared/ui/field';

/** Búsqueda rápida del hero: marca, modelo y color en un solo paso. */
export function QuickSearch() {
  const navigate = useNavigate();
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [colorId, setColorId] = useState('');
  const { brandOptions, modelOptions, colorOptions } = useCatalogOptions(brandId || undefined);
  return (
    <form role="search" onSubmit={(e) => {
      e.preventDefault();
      void navigate(`/autos${toQueryString({ brandId, modelId, colorId })}`);
    }}
      className="grid gap-2 rounded-3xl border border-white/10 bg-white/95 p-2 shadow-lift sm:grid-cols-[1fr_1fr_1fr_auto] dark:bg-ink-900/95">
      <Select aria-label="Marca" options={brandOptions} placeholder="Marca" value={brandId}
        onChange={(e) => (setBrandId(e.target.value), setModelId(''))} className="border-0 text-ink-950 dark:text-white" />
      <Select aria-label="Modelo" options={modelOptions} placeholder="Modelo" value={modelId}
        disabled={!brandId} onChange={(e) => setModelId(e.target.value)} className="border-0 text-ink-950 dark:text-white" />
      <Select aria-label="Color" options={colorOptions} placeholder="Color" value={colorId}
        onChange={(e) => setColorId(e.target.value)} className="border-0 text-ink-950 dark:text-white" />
      <Button type="submit" size="lg"><Search className="size-4" /> Buscar</Button>
    </form>
  );
}
