import type { PurchaseContext } from './purchase-context.js';

/**
 * Chain of Responsibility: cada validador revisa una regla y delega en el siguiente.
 * Las reglas se agregan o reordenan sin modificar la fachada de compra.
 */
export abstract class PurchaseValidator {
  private nextValidator?: PurchaseValidator;

  setNext(validator: PurchaseValidator): PurchaseValidator {
    this.nextValidator = validator;
    return validator;
  }

  validate(context: PurchaseContext): void {
    this.check(context);
    this.nextValidator?.validate(context);
  }

  protected abstract check(context: PurchaseContext): void;
}
