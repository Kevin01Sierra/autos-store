import type { VehicleDto } from '@autos/contracts';
import type { AuthUser } from '../../../../shared/auth/auth-user.js';

export interface PurchaseLine {
  vehicle: VehicleDto;
  quantity: number;
}

export interface PurchaseContext {
  customer: AuthUser;
  lines: PurchaseLine[];
}
