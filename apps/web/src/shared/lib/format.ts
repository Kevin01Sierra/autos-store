const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});
const compact = new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 });
const number = new Intl.NumberFormat('es-CO');
const date = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' });

export const formatPrice = (value: number): string => cop.format(value);
export const formatCompactPrice = (value: number): string => `$${compact.format(value)}`;
export const formatNumber = (value: number): string => number.format(value);
export const formatDate = (iso: string): string => date.format(new Date(iso));
export const formatKm = (km: number): string => (km === 0 ? 'Nuevo' : `${number.format(km)} km`);
