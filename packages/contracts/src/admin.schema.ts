export interface AdminMetricsDto {
  publishedVehicles: number;
  unitsInStock: number;
  pendingApproval: number;
  orders: number;
  revenue: number;
  lowStock: { vehicleId: string; label: string; stock: number }[];
  topSold: { label: string; units: number }[];
}
