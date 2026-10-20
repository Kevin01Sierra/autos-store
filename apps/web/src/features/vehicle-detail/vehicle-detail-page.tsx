import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Badge } from '@/shared/ui/badge';
import { CarIllustration } from '@/shared/ui/car-illustration';
import { ErrorState, Skeleton } from '@/shared/ui/feedback';
import { FinancingSimulator } from './components/financing-simulator';
import { MarketInsight } from './components/market-insight';
import { PriceHistory } from './components/price-history';
import { PurchasePanel } from './components/purchase-panel';
import { SpecList } from './components/spec-list';
import { useVehicle } from './use-vehicle';

export default function VehicleDetailPage() {
  const { id = '' } = useParams();
  const { data: vehicle, isLoading, error } = useVehicle(id);
  if (isLoading) return <Skeleton className="container-page mt-10 h-[480px]" />;
  if (error || !vehicle) return <div className="container-page mt-10"><ErrorState error={error} /></div>;
  const name = `${vehicle.brandName} ${vehicle.modelName}`;
  return (
    <div className="container-page pt-8">
      <Link to="/autos" className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Volver al catálogo
      </Link>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-card bg-gradient-to-b from-surface-sunken to-surface px-6 pt-10 pb-4 sm:px-16">
            <CarIllustration bodyType={vehicle.bodyType} color={vehicle.colorHex} label={`${name} ${vehicle.colorName}`} />
          </section>
          <header>
            <div className="flex flex-wrap gap-2">
              <Badge tone="brand">{vehicle.year}</Badge>
              {vehicle.mileageKm === 0 && <Badge tone="success">0 km</Badge>}
              <Badge>{vehicle.stock} disponibles</Badge>
            </div>
            <h1 className="mt-3 text-4xl font-semibold">{name}</h1>
          </header>
          <SpecList vehicle={vehicle} />
          <MarketInsight vehicle={vehicle} />
          <div className="grid items-start gap-6 md:grid-cols-2">
            <PriceHistory vehicleId={vehicle.id} />
            <FinancingSimulator price={vehicle.price} />
          </div>
        </div>
        <PurchasePanel vehicle={vehicle} />
      </div>
    </div>
  );
}
