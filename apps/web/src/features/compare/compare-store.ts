import { createLocalStore } from '@/shared/hooks/use-local-store';

export const MAX_COMPARE = 3;
const store = createLocalStore<string[]>('rueda-compare', []);

/** Ids de vehículos elegidos para comparar (máximo 3), compartidos por toda la app. */
export function useCompare() {
  const ids = store.useStore();
  const toggle = (id: string) =>
    store.set((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id].slice(-MAX_COMPARE),
    );
  const clear = () => store.set(() => []);
  return { ids, toggle, clear, has: (id: string) => ids.includes(id) };
}
