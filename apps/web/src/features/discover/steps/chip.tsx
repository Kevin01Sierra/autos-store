import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface ChipProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function Chip({ selected, onClick, children }: ChipProps) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected}
      className={cn('rounded-full border px-4 py-2 text-sm transition-all',
        selected
          ? 'border-ink-950 bg-ink-950 text-white dark:border-white dark:bg-white dark:text-ink-950'
          : 'border-line bg-surface-raised hover:border-fg/30')}>
      {children}
    </button>
  );
}
