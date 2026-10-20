import { useId } from 'react';
import { cn } from '../lib/cn';
import { CAR_SHAPES } from './car-shapes';

interface CarIllustrationProps {
  bodyType?: string;
  color: string;
  className?: string;
  label: string;
}

/** Ilustración vectorial del auto pintada con el color real del vehículo. */
export function CarIllustration({ bodyType = 'sedan', color, className, label }: CarIllustrationProps) {
  const shape = CAR_SHAPES[bodyType] ?? CAR_SHAPES.sedan!;
  const id = useId();
  return (
    <svg viewBox="0 0 400 150" role="img" aria-label={label} className={cn('w-full', className)}>
      <defs>
        <linearGradient id={`${id}-paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
        <clipPath id={`${id}-clip`}><path d={shape.body} /></clipPath>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9d6e8" />
          <stop offset="1" stopColor="#3b4a63" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="140" rx="180" ry="7" fill="#000" opacity="0.12" />
      <path d={shape.body} fill={color} stroke="#0b0f19" strokeOpacity="0.28" strokeWidth="1.5" />
      <path d={shape.body} fill={`url(#${id}-paint)`} />
      <path d={shape.windows} fill={`url(#${id}-glass)`} opacity="0.92" />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="102" width="400" height="12" fill="#0b0f19" opacity="0.28" />
        <rect x="372" y="84" width="16" height="7" rx="3.5" fill="#fff6cc" />
        <rect x="14" y="86" width="12" height="7" rx="3" fill="#c3262f" />
      </g>
      {shape.wheels.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="114" r="32" fill="#1b2130" />
          <circle cx={cx} cy="114" r="27" fill="#111" />
          <circle cx={cx} cy="114" r="15" fill="#9aa1b1" />
          <circle cx={cx} cy="114" r="5" fill="#2a3242" />
        </g>
      ))}
    </svg>
  );
}
