import type { VehicleDto } from '@autos/contracts';
import { useState } from 'react';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { ColorDot } from '@/shared/ui/color-dot';
import { useVehicleMutations } from './use-admin-vehicles';

const cell = 'px-3 py-3 align-middle';
const input = 'w-24 rounded-lg border border-line bg-surface-raised px-2 py-1 tabular';

export function VehicleRow({ vehicle: v }: { vehicle: VehicleDto }) {
  const { update, setPrice, archive } = useVehicleMutations();
  const [stock, setStock] = useState(v.stock);
  const [price, setPriceValue] = useState(v.price);
  const dirty = stock !== v.stock || price !== v.price;
  const save = () => {
    if (stock !== v.stock) update.mutate({ id: v.id, data: { stock } });
    if (price !== v.price) setPrice.mutate({ id: v.id, amount: price });
  };
  return (
    <tr className="border-b border-line/60">
      <td className={cell}>
        <p className="font-medium">{v.brandName} {v.modelName}</p>
        <p className="flex items-center gap-1.5 text-xs text-fg-muted"><ColorDot hex={v.colorHex} className="size-2.5" />{v.colorName} · {v.year}</p>
      </td>
      <td className={cell}>
        <input type="number" min={0} value={stock} aria-label="Stock" className={input}
          onChange={(e) => setStock(Number(e.target.value))} />
      </td>
      <td className={cell}>
        <input type="number" min={1} step={100000} value={price} aria-label="Precio" className={`${input} w-36`}
          onChange={(e) => setPriceValue(Number(e.target.value))} />
        <p className="mt-1 text-xs text-fg-muted">{formatPrice(price)}</p>
      </td>
      <td className={`${cell} space-x-1 text-right whitespace-nowrap`}>
        {dirty && <Button size="sm" onClick={save}>Guardar</Button>}
        {v.status === 'draft' && (
          <Button size="sm" variant="dark" onClick={() => update.mutate({ id: v.id, data: { status: 'published' } })}>Aprobar</Button>
        )}
        {v.status !== 'archived' && (
          <Button size="sm" variant="ghost" onClick={() => archive.mutate(v.id)}>Archivar</Button>
        )}
      </td>
    </tr>
  );
}
