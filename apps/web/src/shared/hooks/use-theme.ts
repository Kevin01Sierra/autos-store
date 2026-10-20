import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';
const KEY = 'rueda-theme';
const listeners = new Set<() => void>();

const read = (): Theme => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* almacenamiento no disponible */
  }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const apply = (theme: Theme) => document.documentElement.classList.toggle('dark', theme === 'dark');
apply(read());

/** Tema claro/oscuro persistido; todos los suscriptores se actualizan a la vez. */
export function useTheme() {
  const theme = useSyncExternalStore(
    (listener) => (listeners.add(listener), () => listeners.delete(listener)),
    read,
  );
  const toggle = useCallback(() => {
    const next: Theme = read() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* se aplica solo en esta sesión */
    }
    apply(next);
    listeners.forEach((listener) => listener());
  }, []);
  return { theme, toggle };
}
