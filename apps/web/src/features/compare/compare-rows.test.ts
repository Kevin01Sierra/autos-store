import type { VehicleDto } from '@autos/contracts';
import { describe, expect, it } from 'vitest';
import { bestIds, COMPARE_ROWS } from './compare-rows';

const v = (id: string, price: number, year: number) => ({ id, price, year, mileageKm: 0 }) as VehicleDto;

describe('bestIds', () => {
  it('marca el menor precio y el año más reciente', () => {
    const list = [v('a', 100, 2024), v('b', 80, 2026)];
    const [priceRow, yearRow] = COMPARE_ROWS;
    expect([...bestIds(priceRow!, list)]).toEqual(['b']);
    expect([...bestIds(yearRow!, list)]).toEqual(['b']);
  });

  it('no resalta nada con un solo vehículo', () => {
    expect(bestIds(COMPARE_ROWS[0]!, [v('a', 1, 2020)]).size).toBe(0);
  });
});
