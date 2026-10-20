/** Registro normalizado de mercado, independiente de la fuente de la que provenga. */
export interface MarketRecord {
  brand: string;
  model: string;
  color: string | null;
  /** Primer día del mes, formato YYYY-MM-DD. */
  period: string;
  units: number;
  source: string;
}

const titleCase = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase());

export const normalizeName = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? titleCase(value) : null;

export const monthStart = (value: unknown): string | null => {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`;
};

export const popularityKey = (brand: string, model: string, color?: string | null): string =>
  [brand, model, color ?? ''].map((part) => part.trim().toLowerCase()).join('|');
