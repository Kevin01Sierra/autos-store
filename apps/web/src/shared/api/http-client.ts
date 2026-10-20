import { ApiError } from './api-error';

type Query = Record<string, string | number | boolean | undefined | null>;
type TokenProvider = () => Promise<string | null>;

/**
 * Cliente HTTP único. Recibe por inyección la forma de obtener el token,
 * así no depende de Supabase ni de React y se puede probar en aislamiento.
 */
export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly getToken: TokenProvider,
  ) {}

  get<T>(path: string, query?: Query): Promise<T> {
    return this.request<T>('GET', path + toQueryString(query));
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  delete(path: string): Promise<void> {
    return this.request<void>('DELETE', path);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = await this.getToken();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) throw await ApiError.from(response);
    return (response.status === 204 ? undefined : await response.json()) as T;
  }
}

/** Omite parámetros vacíos para no enviar filtros sin valor. */
export function toQueryString(query?: Query): string {
  const entries = Object.entries(query ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== '');
  return entries.length ? `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)]))}` : '';
}
