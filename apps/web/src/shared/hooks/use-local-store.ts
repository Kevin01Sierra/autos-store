import { useSyncExternalStore } from 'react';

/**
 * Pequeño store observable persistido en localStorage (patrón Observer).
 * Sirve para estado de conveniencia por usuario: comparador, preferencias anónimas.
 */
export function createLocalStore<T>(key: string, initial: T) {
  const listeners = new Set<() => void>();
  let cache: T = initial;
  try {
    const raw = localStorage.getItem(key);
    if (raw) cache = JSON.parse(raw) as T;
  } catch {
    /* sin almacenamiento: se usa el valor inicial */
  }

  const set = (updater: (current: T) => T) => {
    cache = updater(cache);
    try {
      localStorage.setItem(key, JSON.stringify(cache));
    } catch {
      /* se mantiene en memoria */
    }
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useStore = () => useSyncExternalStore(subscribe, () => cache);
  return { useStore, set, get: () => cache };
}
