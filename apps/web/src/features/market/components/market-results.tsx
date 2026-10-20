import type { MarketInsightDto } from '@autos/contracts';
import { BarChart3 } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { EmptyState, ErrorState, Skeleton } from '@/shared/ui/feedback';
import { MarketChart } from './market-chart';
import { MarketTable } from './market-table';

interface MarketResultsProps {
  data?: MarketInsightDto[];
  loading: boolean;
  error: unknown;
  view: 'chart' | 'table';
}

function Body({ data, loading, error, view }: MarketResultsProps) {
  if (loading) return <Skeleton className="h-72" />;
  if (error) return <ErrorState error={error} />;
  if (!data?.length) return <EmptyState icon={BarChart3} title="Sin datos para ese filtro" />;
  return view === 'chart' ? <MarketChart rows={data} /> : <MarketTable rows={data} />;
}

export function MarketResults(props: MarketResultsProps) {
  const isDemo = props.data?.some((r) => r.source === 'demo');
  return (
    <>
      <Card className="mt-6 p-6"><Body {...props} /></Card>
      {isDemo && (
        <p className="mt-3 text-xs text-fg-muted">
          Mostrando datos de demostración hasta la primera sincronización con datos.gov.co.
        </p>
      )}
    </>
  );
}
