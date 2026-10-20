import { describe, expect, it } from 'vitest';
import { modelUnits, monthStart, popularityKey } from '../../src/modules/market-data/domain/market-record.js';
import { buildSocrataQuery } from '../../src/modules/market-data/infrastructure/socrata-query.js';

const URL_RISARALDA = 'https://www.datos.gov.co/resource/x9pp-pcn5.json';
const params = (url: string) => new URL(url).searchParams;

describe('Consulta a datos.gov.co (Socrata)', () => {
  it('agrupa por año modelo y aplica el filtro cuando el conjunto no trae color', () => {
    const query = params(buildSocrataQuery(URL_RISARALDA, {
      brand: 'marca', model: 'linea', period: 'modelo', periodType: 'year',
      where: "clase in('AUTOMOVIL') AND modelo >= 2018",
    }));
    expect(query.get('$select')).toBe('marca,linea,modelo as period,count(*) as units');
    expect(query.get('$group')).toBe('marca,linea,modelo');
    expect(query.get('$where')).toBe("clase in('AUTOMOVIL') AND modelo >= 2018");
  });

  it('trunca por mes cuando la columna es una fecha e incluye el color si existe', () => {
    const query = params(buildSocrataQuery(URL_RISARALDA, {
      brand: 'marca', model: 'linea', color: 'color', period: 'fecha', periodType: 'date',
    }));
    expect(query.get('$group')).toBe('marca,linea,color,date_trunc_ym(fecha)');
    expect(query.has('$where')).toBe(false);
  });

  it('convierte un año en el primer día de ese año', () => {
    expect(monthStart('2024')).toBe('2024-01-01');
  });
});

describe('Unidades por modelo con versiones', () => {
  const units = new Map([
    [popularityKey('Kia', 'Picanto'), 100],
    [popularityKey('Kia', 'Picanto Ekotaxi'), 40],
    [popularityKey('Kia', 'Picantox'), 999],
    [popularityKey('Kia', 'Picanto', 'Rojo'), 30],
    [popularityKey('Renault', 'Picanto'), 7],
  ]);

  it('suma el modelo y sus versiones, sin mezclar otros modelos, marcas ni colores', () => {
    expect(modelUnits(units, 'KIA', 'picanto')).toBe(140);
    expect(modelUnits(units, 'Kia', 'Sportage')).toBe(0);
  });
});
