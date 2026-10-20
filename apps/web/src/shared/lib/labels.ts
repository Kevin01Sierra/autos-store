import type { OrderStatus } from '@autos/contracts';

export const BODY_LABELS: Record<string, string> = {
  sedan: 'Sedán', hatchback: 'Hatchback', suv: 'SUV', pickup: 'Pick-up', van: 'Van', coupe: 'Coupé',
};

export const FUEL_LABELS: Record<string, string> = {
  gasoline: 'Gasolina', diesel: 'Diésel', hybrid: 'Híbrido', electric: 'Eléctrico',
};

export const TRANSMISSION_LABELS: Record<string, string> = {
  manual: 'Mecánica', automatic: 'Automática',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente', paid: 'Pagado', delivered: 'Entregado', cancelled: 'Cancelado',
};

export const VEHICLE_STATUS_LABELS: Record<string, string> = {
  draft: 'En revisión', published: 'Publicado', archived: 'Archivado',
};
