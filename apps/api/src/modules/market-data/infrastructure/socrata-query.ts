/** Columnas del conjunto de datos de Socrata que alimentan el ranking de mercado. */
export interface SocrataFields {
  brand: string;
  model: string;
  /** Opcional: no todos los conjuntos publican el color. */
  color?: string;
  period: string;
  /** "year": la columna ya es un año (p. ej. año modelo); "date": fecha a truncar por mes. */
  periodType: 'year' | 'date';
  /** Filtro SoQL opcional, p. ej. solo automóviles recientes. */
  where?: string;
}

/** Arma la consulta SoQL agregada: unidades por marca, modelo, color (si hay) y periodo. */
export function buildSocrataQuery(url: string, fields: SocrataFields): string {
  const dimensions = [fields.brand, fields.model, ...(fields.color ? [fields.color] : [])];
  const period = fields.periodType === 'date' ? `date_trunc_ym(${fields.period})` : fields.period;
  const query = new URLSearchParams({
    $select: `${dimensions.join(',')},${period} as period,count(*) as units`,
    $group: `${dimensions.join(',')},${period}`,
    $order: 'count(*) DESC',
    $limit: '5000',
  });
  if (fields.where) query.set('$where', fields.where);
  return `${url}?${query.toString()}`;
}

/**
 * Limpia un valor pegado en el panel de Vercel: espacios, comillas o backticks envolventes
 * y comillas tipográficas (‘ ’), que SoQL no acepta.
 */
export const cleanSetting = (value?: string): string | undefined =>
  value?.replace(/[‘’]/g, "'").trim().replace(/^([`'"])(.*)\1$/s, '$2').trim() || undefined;
