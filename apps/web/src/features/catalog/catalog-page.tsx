import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { CompareBar } from '@/features/compare/compare-bar';
import { formatNumber } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { ErrorState } from '@/shared/ui/feedback';
import { FiltersPanel } from './components/filters-panel';
import { Pagination } from './components/pagination';
import { VehicleGrid } from './components/vehicle-grid';
import { useVehicleSearch } from './hooks/use-vehicle-search';

export default function CatalogPage() {
  const { query, result, setFilter, clear } = useVehicleSearch();
  const [showFilters, setShowFilters] = useState(false);
  const data = result.data;
  return (
    <div className="container-page pt-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Autos disponibles</h1>
          <p className="mt-2 text-fg-muted">
            {data ? `${formatNumber(data.total)} vehículos listos para entrega` : 'Cargando inventario…'}
          </p>
        </div>
        <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="size-4" /> Filtros
        </Button>
      </header>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className={showFilters ? 'block' : 'hidden lg:block'}>
          <FiltersPanel query={query} onChange={setFilter} onClear={clear} />
        </div>
        <section aria-live="polite" aria-busy={result.isFetching}>
          {result.error ? <ErrorState error={result.error} /> : (
            <VehicleGrid vehicles={data?.items} loading={result.isLoading}
              emptyAction={<Button variant="outline" onClick={clear}>Ver todo el inventario</Button>} />
          )}
          {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total}
            onPage={(p) => setFilter('page', String(p))} />}
        </section>
      </div>
      <CompareBar />
    </div>
  );
}
