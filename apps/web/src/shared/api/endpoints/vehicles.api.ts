import type {
  CreateVehicleDto, Paginated, PriceDto, UpdateVehicleDto, VehicleDto, VehicleFilter,
} from '@autos/contracts';
import type { HttpClient } from '../http-client';

export type VehicleQuery = Partial<VehicleFilter>;

export const createVehiclesApi = (http: HttpClient) => ({
  search: (filter: VehicleQuery) => http.get<Paginated<VehicleDto>>('/vehicles', filter),
  manage: (filter: VehicleQuery) => http.get<Paginated<VehicleDto>>('/vehicles/manage', filter),
  get: (id: string) => http.get<VehicleDto>(`/vehicles/${id}`),
  register: (data: CreateVehicleDto) => http.post<VehicleDto>('/vehicles', data),
  update: (id: string, data: UpdateVehicleDto) => http.patch<VehicleDto>(`/vehicles/${id}`, data),
  archive: (id: string) => http.delete(`/vehicles/${id}`),
  prices: (id: string) => http.get<PriceDto[]>(`/vehicles/${id}/prices`),
  setPrice: (id: string, amount: number) =>
    http.post<PriceDto>(`/vehicles/${id}/prices`, { amount, currency: 'COP' }),
});

export type VehiclesApi = ReturnType<typeof createVehiclesApi>;
