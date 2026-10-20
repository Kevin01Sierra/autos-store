import { describe, expect, it } from 'vitest';
import {
  mergeRecords, monthStart, normalizeName, popularityKey,
} from '../../src/modules/market-data/domain/market-record.js';
import { ResilientMarketSource } from '../../src/modules/market-data/infrastructure/resilient-market.source.js';

describe('Normalización de datos de mercado', () => {
  it('normaliza nombres de la fuente externa', () => {
    expect(normalizeName('  CHEVROLET   tracker ')).toBe('Chevrolet Tracker');
    expect(normalizeName('')).toBeNull();
    expect(normalizeName(42)).toBeNull();
  });

  it('lleva cualquier fecha al primer día del mes', () => {
    expect(monthStart('2026-09-17T10:00:00.000')).toBe('2026-09-01');
    expect(monthStart('no es fecha')).toBeNull();
  });

  it('suma las filas que quedan repetidas tras normalizar', () => {
    const row = { brand: 'Chevrolet', model: 'Spark Gt', color: null, period: '2020-01-01', source: 'x' };
    expect(mergeRecords([{ ...row, units: 2 }, { ...row, units: 3 }])).toEqual([{ ...row, units: 5 }]);
  });

  it('genera claves sin importar mayúsculas', () => {
    expect(popularityKey('Mazda', 'CX-30', 'Gris')).toBe(popularityKey('MAZDA', 'cx-30', 'gris'));
  });
});

describe('ResilientMarketSource (Decorator)', () => {
  it('reintenta ante fallos y luego usa la caché', async () => {
    let calls = 0;
    const flaky = {
      name: 'flaky',
      fetchRecords: async () => {
        calls += 1;
        if (calls === 1) throw new Error('timeout');
        return [];
      },
    };
    const source = new ResilientMarketSource(flaky, 60_000, 3);
    await source.fetchRecords();
    await source.fetchRecords();
    expect(calls).toBe(2);
  });
});
