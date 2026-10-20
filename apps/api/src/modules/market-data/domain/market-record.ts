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

/**
 * Unidades de un modelo sumando sus versiones: las fuentes oficiales registran la línea
 * con la versión ("Picanto Ekotaxi", "Duster Dynamique"), el catálogo solo el modelo.
 */
export const modelUnits = (units: Map<string, number>, brand: string, model: string): number => {
  const [b, m] = [brand, model].map((part) => part.trim().toLowerCase());
  let total = 0;
  for (const [key, value] of units) {
    const [kb, km, kc] = key.split('|');
    if (kc === '' && kb === b && (km === m || km?.startsWith(`${m} `))) total += value;
  }
  return total;
};

/** Suma las filas que quedan iguales tras normalizar ("SPARK GT" y "Spark  Gt"). */
export const mergeRecords = (records: MarketRecord[]): MarketRecord[] => {
  const merged = new Map<string, MarketRecord>();
  for (const r of records) {
    const key = [r.brand, r.model, r.color ?? '', r.period, r.source].join('|');
    const prev = merged.get(key);
    merged.set(key, prev ? { ...prev, units: prev.units + r.units } : r);
  }
  return [...merged.values()];
};
