import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useServices } from '@/shared/api/services-context';
import { useAuth } from '@/shared/auth/auth-context';
import { Button } from '@/shared/ui/button';
import { ErrorState, Skeleton } from '@/shared/ui/feedback';
import { hasPreferences, preferencesStore } from './preferences-store';
import { RecommendationCard } from './recommendation-card';
import { useRecommendations } from './use-recommendations';
import { Wizard } from './wizard';

export default function DiscoverPage() {
  const preferences = preferencesStore.useStore();
  const [editing, setEditing] = useState(!hasPreferences(preferences));
  const { user } = useAuth();
  const { recommendations } = useServices();
  const save = useMutation({ mutationFn: recommendations.savePreferences });
  const results = useRecommendations(preferences, 6);

  if (editing) {
    return (
      <div className="container-page pt-12">
        <Wizard initial={preferences} onFinish={(next) => {
          preferencesStore.set(() => next);
          if (user) save.mutate(next);
          setEditing(false);
        }} />
      </div>
    );
  }
  return (
    <div className="container-page max-w-4xl pt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">Tus recomendaciones</p>
          <h1 className="mt-2 text-3xl font-semibold">Los autos que más encajan contigo</h1>
          <p className="mt-2 text-fg-muted">Combinamos tus gustos con lo más matriculado en Colombia y lo más vendido aquí.</p>
        </div>
        <Button variant="outline" onClick={() => setEditing(true)}>Cambiar preferencias</Button>
      </div>
      {results.error && <ErrorState error={results.error} />}
      <div className="flex flex-col gap-4">
        {results.isLoading && Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-44" />)}
        {results.data?.map((item, i) => <RecommendationCard key={item.vehicle.id} item={item} rank={i + 1} />)}
      </div>
    </div>
  );
}
