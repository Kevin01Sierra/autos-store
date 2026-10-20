import type { VehicleFilter } from '@autos/contracts';
import { and, eq, gt, gte, ilike, lte, or, type SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { brands, models, vehicles } from '../../../shared/database/schema/index.js';
import { currentPrice } from './vehicle-read.query.js';

/**
 * Builder: arma la cláusula WHERE paso a paso, agregando solo
 * los filtros que el usuario realmente envió.
 */
export class VehicleConditionsBuilder {
  private readonly conditions: SQL[] = [];

  static from(filter: VehicleFilter): SQL | undefined {
    return new VehicleConditionsBuilder()
      .equals(vehicles.status, filter.status ?? 'published')
      .equals(brands.id, filter.brandId)
      .equals(models.id, filter.modelId)
      .equals(vehicles.colorId, filter.colorId)
      .priceBetween(filter.minPrice, filter.maxPrice)
      .minYear(filter.minYear)
      .search(filter.search)
      .available(filter.onlyAvailable)
      .build();
  }

  private equals(column: PgColumn, value?: string): this {
    return value ? this.add(eq(column, value)) : this;
  }

  private priceBetween(min?: number, max?: number): this {
    if (min !== undefined) this.add(gte(currentPrice.amount, min));
    return max !== undefined ? this.add(lte(currentPrice.amount, max)) : this;
  }

  private minYear(year?: number): this {
    return year ? this.add(gte(vehicles.year, year)) : this;
  }

  private search(term?: string): this {
    if (!term) return this;
    const pattern = `%${term}%`;
    return this.add(or(ilike(models.name, pattern), ilike(brands.name, pattern)) as SQL);
  }

  private available(onlyAvailable: boolean): this {
    return onlyAvailable ? this.add(gt(vehicles.stock, 0)) : this;
  }

  private add(condition: SQL): this {
    this.conditions.push(condition);
    return this;
  }

  private build(): SQL | undefined {
    return and(...this.conditions);
  }
}
