import type { VehicleDto } from '@autos/contracts';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/shared/auth/auth-context';
import { formatPrice } from '@/shared/lib/format';
import { Button, buttonVariants } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { usePurchase } from '../use-vehicle';

export function PurchasePanel({ vehicle }: { vehicle: VehicleDto }) {
  const { user } = useAuth();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const purchase = usePurchase(vehicle.id);
  const max = Math.min(vehicle.stock, 3);
  return (
    <Card className="sticky top-24 flex flex-col gap-5 p-6">
      <div>
        <p className="text-sm text-fg-muted">Precio de contado</p>
        <p className="tabular font-display text-3xl font-semibold">{formatPrice(vehicle.price * quantity)}</p>
      </div>
      {vehicle.stock > 0 ? (
        <label className="flex items-center justify-between text-sm">
          Unidades
          <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded-lg border border-line bg-surface-raised px-3 py-2">
            {Array.from({ length: max }, (_, i) => <option key={i + 1}>{i + 1}</option>)}
          </select>
        </label>
      ) : <p className="text-sm font-medium text-danger">Agotado por ahora</p>}
      {user ? (
        <Button size="lg" disabled={vehicle.stock === 0 || purchase.isPending}
          onClick={() => purchase.mutate(quantity)}>
          {purchase.isPending ? 'Procesando…' : 'Comprar ahora'}
        </Button>
      ) : (
        <Link to="/ingresar" state={{ from: location.pathname }} className={buttonVariants({ size: 'lg' })}>
          Ingresa para comprar
        </Link>
      )}
      <p className="flex items-start gap-2 text-xs text-fg-muted">
        <ShieldCheck className="size-4 shrink-0 text-success" />
        Reservamos tu unidad al confirmar. Puedes cancelar el pedido mientras esté pendiente.
      </p>
    </Card>
  );
}
