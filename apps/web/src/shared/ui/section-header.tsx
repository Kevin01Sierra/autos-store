import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
