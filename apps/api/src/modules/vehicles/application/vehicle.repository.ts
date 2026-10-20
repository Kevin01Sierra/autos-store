import type {
  CreateVehicleDto, Paginated, UpdateVehicleDto, VehicleDto, VehicleFilter,
} from '@autos/contracts';

export type NewVehicle = CreateVehicleDto & { sellerId: string };

/** Puerto de persistencia de vehículos. */
export interface VehicleRepository {
  search(filter: VehicleFilter): Promise<Paginated<VehicleDto>>;
  findById(id: string): Promise<VehicleDto | null>;
  findAvailable(limit: number): Promise<VehicleDto[]>;
  create(data: NewVehicle): Promise<VehicleDto>;
  update(id: string, data: UpdateVehicleDto): Promise<VehicleDto | null>;
  remove(id: string): Promise<boolean>;
}

export const VEHICLE_REPOSITORY = Symbol('VEHICLE_REPOSITORY');
