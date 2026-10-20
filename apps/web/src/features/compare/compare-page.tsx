import { useQueries } from '@tanstack/react-query';
import { GitCompareArrows } from 'lucide-react';
import { Link } from 'react-router';
import { queryKeys } from '@/shared/api/query-keys';
import { useServices } from '@/shared/api/services-context';
import { buttonVariants } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/feedback';
import { CompareTable } from './compare-table';
import { useCompare } from './compare-store';

export default function ComparePage() {
  const { ids, toggle } = useCompare();
  const { vehicles } = useServices();
  const results = useQueries({
    queries: ids.map((id) => ({ queryKey: queryKeys.vehicle(id), queryFn: () => vehicles.get(id) })),
  });
  const list = results.flatMap((r) => (r.data ? [r.data] : []));
  if (ids.length === 0) {
    return (
      <div className="container-page pt-16">
        <EmptyState icon={GitCompareArrows} title="Aún no elegiste autos para comparar"
          description="Marca hasta 3 autos con el botón «Comparar» en el catálogo."
          action={<Link to="/autos" className={buttonVariants()}>Ir al catálogo</Link>} />
      </div>
    );
  }
  return (
    <div className="container-page overflow-x-auto pt-10">
      <h1 className="mb-8 text-3xl font-semibold">Comparador</h1>
      <CompareTable vehicles={list} onRemove={toggle} />
    </div>
  );
}
