import type { VehicleDto } from '@autos/contracts';

/** Crea un vehículo de prueba con valores por defecto razonables. */
export const aVehicle = (overrides: Partial<VehicleDto> = {}): VehicleDto => ({
  id: '00000000-0000-4000-8000-000000000001',
  modelId: 'model-mazda-2',
  colorId: 'color-rojo',
  brandId: 'brand-mazda',
  brandName: 'Mazda',
  modelName: 'Mazda 2',
  bodyType: 'sedan',
  fuelType: 'gasoline',
  colorName: 'Rojo',
  colorHex: '#B3202A',
  year: 2026,
  mileageKm: 0,
  transmission: 'automatic',
  stock: 3,
  status: 'published',
  imageUrls: [],
  price: 89_900_000,
  sellerId: 'seller-1',
  ...overrides,
});

export const aCustomer = { id: 'customer-1', role: 'customer' as const };
