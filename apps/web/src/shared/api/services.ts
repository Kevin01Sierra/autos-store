import type {
  BrandDto, ColorDto, CreateBrandDto, CreateColorDto, CreateModelDto, ModelDto,
} from '@autos/contracts';
import {
  createAdminApi, createMarketApi, createOrdersApi, createRecommendationsApi,
} from './endpoints/commerce.api';
import { createResourceApi } from './endpoints/resource.api';
import { createVehiclesApi } from './endpoints/vehicles.api';
import { HttpClient } from './http-client';

/** Contenedor de servicios: se construye una vez y se inyecta con React Context. */
export function createServices(baseUrl: string, getToken: () => Promise<string | null>) {
  const http = new HttpClient(baseUrl, getToken);
  return {
    brands: createResourceApi<BrandDto, CreateBrandDto>(http, '/brands'),
    models: createResourceApi<ModelDto, CreateModelDto>(http, '/models'),
    colors: createResourceApi<ColorDto, CreateColorDto>(http, '/colors'),
    vehicles: createVehiclesApi(http),
    orders: createOrdersApi(http),
    recommendations: createRecommendationsApi(http),
    market: createMarketApi(http),
    admin: createAdminApi(http),
  };
}

export type Services = ReturnType<typeof createServices>;
