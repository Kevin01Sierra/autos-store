import { z } from 'zod';

export const ORDER_STATUSES = ['pending', 'paid', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const purchaseSchema = z.object({
  items: z
    .array(z.object({ vehicleId: z.uuid(), quantity: z.number().int().min(1).max(3) }))
    .min(1)
    .max(5)
    .refine((items) => new Set(items.map((i) => i.vehicleId)).size === items.length, {
      message: 'No repitas un vehículo: ajusta su cantidad',
    }),
});

export const changeOrderStatusSchema = z.object({ status: z.enum(ORDER_STATUSES) });

export type PurchaseDto = z.infer<typeof purchaseSchema>;
export type ChangeOrderStatusDto = z.infer<typeof changeOrderStatusSchema>;

export interface OrderItemDto {
  vehicleId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDto {
  id: string;
  customerId: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItemDto[];
}
