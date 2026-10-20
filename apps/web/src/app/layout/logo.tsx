import { Link } from 'react-router';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold" aria-label="Rueda, inicio">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="9" className="fill-ink-950 dark:fill-white" />
        <circle cx="16" cy="16" r="8" fill="none" stroke="#FF5A1F" strokeWidth="3" />
        <circle cx="16" cy="16" r="2.5" fill="#FF5A1F" />
      </svg>
      Rueda
    </Link>
  );
}
