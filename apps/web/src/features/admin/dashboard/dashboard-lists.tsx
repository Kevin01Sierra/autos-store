import type { AdminMetricsDto } from '@autos/contracts';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '@/shared/ui/card';

export function LowStockCard({ items }: { items: AdminMetricsDto['lowStock'] }) {
  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="size-4 text-warning" /> Stock bajo
      </h2>
      <ul className="mt-4 divide-y divide-line text-sm">
        {items.length === 0 && <li className="py-2 text-fg-muted">Todo el inventario está bien abastecido.</li>}
        {items.map((v) => (
          <li key={v.vehicleId} className="flex justify-between py-2">
            <Link to={`/autos/${v.vehicleId}`} className="hover:underline">{v.label}</Link>
            <span className="tabular font-medium text-warning">{v.stock} uds.</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function TopSoldCard({ items }: { items: AdminMetricsDto['topSold'] }) {
  return (
    <Card className="p-6">
      <h2 className="font-semibold">Más vendidos en la tienda</h2>
      <ol className="mt-4 divide-y divide-line text-sm">
        {items.length === 0 && <li className="py-2 text-fg-muted">Aún no hay ventas.</li>}
        {items.map((t, i) => (
          <li key={t.label} className="flex justify-between py-2">
            <span>{i + 1}. {t.label}</span>
            <span className="tabular">{t.units} uds.</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
