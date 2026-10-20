import type {
  AdminMetricsDto, MarketInsightDto, OrderDto, OrderStatus, PreferencesDto, PurchaseDto,
  RecommendationDto,
} from '@autos/contracts';
import type { HttpClient } from '../http-client';

export const createOrdersApi = (http: HttpClient) => ({
  purchase: (data: PurchaseDto) => http.post<OrderDto>('/orders', data),
  list: () => http.get<OrderDto[]>('/orders'),
  changeStatus: (id: string, status: OrderStatus) =>
    http.patch<OrderDto>(`/orders/${id}/status`, { status }),
});

export const createRecommendationsApi = (http: HttpClient) => ({
  recommend: (preferences: PreferencesDto, limit = 8) =>
    http.post<RecommendationDto[]>(`/recommendations?limit=${limit}`, preferences),
  mine: (limit = 8) => http.get<RecommendationDto[]>('/recommendations/me', { limit }),
  savePreferences: (preferences: PreferencesDto) =>
    http.put<PreferencesDto>('/preferences/me', preferences),
});

export const createMarketApi = (http: HttpClient) => ({
  top: (query: { brand?: string; color?: string; limit?: number }) =>
    http.get<MarketInsightDto[]>('/market/top', query),
});

export const createAdminApi = (http: HttpClient) => ({
  metrics: () => http.get<AdminMetricsDto>('/admin/metrics'),
});
