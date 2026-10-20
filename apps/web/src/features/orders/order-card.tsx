import type { OrderDto } from '@autos/contracts';
import type { ReactNode } from 'react';
import { useVehicle } from '@/features/vehicle-detail/use-vehicle';
import { formatDate, formatPrice } from '@/shared/lib/format';
import { STATUS_LABELS } from '@/shared/lib/labels';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

const TONES = { pending: 'warning', paid: 'brand', delivered: 'success', cancelled: 'neutral' } as const;

function ItemLine({ vehicleId, quantity, unitPrice }: OrderDto['items'][number]) {
  const { data } = useVehicle(vehicleId);
  return (
    <li className="flex justify-between gap-4 text-sm">
      <span>{quantity} × {data ? `${data.brandName} ${data.modelName} · ${data.colorName}` : 'Vehículo'}</span>
      <span className="tabular text-fg-muted">{formatPrice(unitPrice)}</span>
    </li>
  );
}

export function OrderCard({ order, actions }: { order: OrderDto; actions?: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-fg-muted">Pedido #{order.id.slice(0, 8)} · {formatDate(order.createdAt)}</p>
          <p className="tabular mt-1 text-lg font-semibold">{formatPrice(order.total)}</p>
        </div>
        <Badge tone={TONES[order.status]}>{STATUS_LABELS[order.status]}</Badge>
      </div>
      <ul className="mt-4 space-y-1 border-t border-line pt-4">
        {order.items.map((item) => <ItemLine key={item.vehicleId} {...item} />)}
      </ul>
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}
