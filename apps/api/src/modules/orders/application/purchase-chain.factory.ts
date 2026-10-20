import {
  CurrentPriceValidator, OwnVehicleValidator, PublishedVehicleValidator,
  QuantityLimitValidator, StockAvailableValidator,
} from '../domain/validation/purchase-validators.js';
import type { PurchaseValidator } from '../domain/validation/purchase-validator.js';

export const MAX_UNITS_PER_PURCHASE = 5;

/** Arma la cadena de validaciones de compra en el orden en que deben evaluarse. */
export function createPurchaseChain(): PurchaseValidator {
  const head = new QuantityLimitValidator(MAX_UNITS_PER_PURCHASE);
  head
    .setNext(new PublishedVehicleValidator())
    .setNext(new OwnVehicleValidator())
    .setNext(new CurrentPriceValidator())
    .setNext(new StockAvailableValidator());
  return head;
}
