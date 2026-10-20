import { describe, expect, it } from 'vitest';
import { createRecommendationStrategy } from '../../src/modules/recommendations/application/recommendation-strategy.factory.js';
import { EMPTY_PREFERENCES } from '../../src/modules/recommendations/application/recommendation.ports.js';
import type { RecommendationContext } from '../../src/modules/recommendations/domain/recommendation-strategy.js';
import { aVehicle } from '../support/vehicle.fixture.js';

const mazdaRed = aVehicle();
const kiaWhite = aVehicle({
  id: 'kia', brandId: 'brand-kia', brandName: 'Kia', modelId: 'model-picanto',
  modelName: 'Picanto', colorId: 'color-blanco', colorName: 'Blanco', price: 64_900_000,
});

const context = (overrides: Partial<RecommendationContext> = {}): RecommendationContext => ({
  preferences: EMPTY_PREFERENCES,
  marketUnits: new Map([['kia|picanto|blanco', 1450], ['mazda|mazda 2|rojo', 1120]]),
  salesUnits: new Map([['model-mazda-2|color-rojo', 4]]),
  ...overrides,
});

describe('Recomendaciones (Strategy + Composite + Factory)', () => {
  it('sin preferencias prioriza la popularidad de mercado', () => {
    const strategy = createRecommendationStrategy(EMPTY_PREFERENCES);
    const kia = strategy.score(kiaWhite, context());
    const mazda = strategy.score(mazdaRed, context());
    expect(kia.reasons[0]).toContain('1.450 unidades');
    expect(mazda.reasons).toContain('4 compras en nuestra tienda');
    expect(kia.score).toBeGreaterThan(0);
  });

  it('con preferencias de color sube el vehículo que coincide', () => {
    const preferences = { ...EMPTY_PREFERENCES, colorIds: ['color-rojo'] };
    const strategy = createRecommendationStrategy(preferences);
    const ctx = context({ preferences });
    expect(strategy.score(mazdaRed, ctx).score).toBeGreaterThan(strategy.score(kiaWhite, ctx).score);
    expect(strategy.score(mazdaRed, ctx).reasons).toContain('Coincide con tu color');
  });

  it('usa la popularidad del modelo cuando no hay dato por color', () => {
    const strategy = createRecommendationStrategy(EMPTY_PREFERENCES);
    const ctx = context({ marketUnits: new Map([['mazda|mazda 2|', 500]]), salesUnits: new Map() });
    expect(strategy.score(mazdaRed, ctx).reasons[0]).toMatch(/^Mazda 2: 500 unidades/);
  });

  it('respeta el presupuesto', () => {
    const preferences = { ...EMPTY_PREFERENCES, maxBudget: 70_000_000 };
    const ctx = context({ preferences, marketUnits: new Map(), salesUnits: new Map() });
    const strategy = createRecommendationStrategy(preferences);
    expect(strategy.score(kiaWhite, ctx).score).toBeGreaterThan(strategy.score(mazdaRed, ctx).score);
  });
});
