import { Link } from 'react-router';
import { VehicleGrid } from '@/features/catalog/components/vehicle-grid';
import { hasPreferences, preferencesStore } from '@/features/discover/preferences-store';
import { useRecommendations } from '@/features/discover/use-recommendations';
import { buttonVariants } from '@/shared/ui/button';
import { SectionHeader } from '@/shared/ui/section-header';

/** Sin preferencias muestra lo más popular; con preferencias, lo más afín al usuario. */
export function RecommendedSection() {
  const preferences = preferencesStore.useStore();
  const personal = hasPreferences(preferences);
  const { data, isLoading } = useRecommendations(preferences, 6);
  const highlights = Object.fromEntries(
    (data ?? []).map((r) => [r.vehicle.id, `${Math.round(r.score * 100)}% ${personal ? 'afinidad' : 'popularidad'}`]),
  );
  return (
    <section className="container-page pt-16">
      <SectionHeader eyebrow={personal ? 'Para ti' : 'Más elegidos'}
        title={personal ? 'Recomendados según tus gustos' : 'Los más comprados ahora'}
        description="Puntaje calculado con matrículas reales del mercado y ventas de la tienda."
        action={<Link to="/descubre" className={buttonVariants({ variant: 'outline' })}>
          {personal ? 'Ajustar preferencias' : 'Personalizar'}
        </Link>} />
      <VehicleGrid vehicles={data?.map((r) => r.vehicle)} loading={isLoading} highlights={highlights} />
    </section>
  );
}
