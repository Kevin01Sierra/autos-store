import { cn } from '../lib/cn';

export function ColorDot({ hex, className }: { hex: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-block size-3.5 rounded-full ring-1 ring-black/10 ring-offset-1', className)}
      style={{ backgroundColor: hex }}
    />
  );
}
