import type { ColorDto } from '@autos/contracts';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface ColorSwatchesProps {
  colors: ColorDto[];
  selected?: string | string[];
  onSelect: (id: string) => void;
}

/** Selector visual de color: más rápido de escanear que una lista desplegable. */
export function ColorSwatches({ colors, selected, onSelect }: ColorSwatchesProps) {
  const isSelected = (id: string) =>
    Array.isArray(selected) ? selected.includes(id) : selected === id;
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {colors.map((color) => (
        <button key={color.id} type="button" onClick={() => onSelect(color.id)}
          aria-pressed={isSelected(color.id)} title={color.name}
          className={cn('grid size-9 place-items-center rounded-full ring-1 ring-black/10 transition',
            isSelected(color.id) ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-surface' : 'hover:scale-110')}
          style={{ backgroundColor: color.hex }}>
          <span className="sr-only">{color.name}</span>
          {isSelected(color.id) && <Check className="size-4 mix-blend-difference text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );
}
