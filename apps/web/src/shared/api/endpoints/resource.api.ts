import type { HttpClient } from '../http-client';

/** API genérica para recursos CRUD (marcas, modelos, colores). */
export interface ResourceApi<T, TCreate, TUpdate = Partial<TCreate>> {
  list(query?: Record<string, string | undefined>): Promise<T[]>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  remove(id: string): Promise<void>;
}

export function createResourceApi<T, TCreate, TUpdate = Partial<TCreate>>(
  http: HttpClient,
  path: string,
): ResourceApi<T, TCreate, TUpdate> {
  return {
    list: (query) => http.get<T[]>(path, query),
    create: (data) => http.post<T>(path, data),
    update: (id, data) => http.patch<T>(`${path}/${id}`, data),
    remove: (id) => http.delete(`${path}/${id}`),
  };
}
