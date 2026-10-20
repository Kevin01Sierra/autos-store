import type { ReactNode } from 'react';
import type { ResourceApi } from '@/shared/api/endpoints/resource.api';
import type { Option } from '@/shared/ui/field';

export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'color' | 'select';
  options?: Option[];
}

/**
 * Configuración declarativa de un recurso CRUD. El mismo componente
 * ResourceManager administra marcas, modelos y colores (DRY).
 */
export interface ResourceConfig<T extends { id: string }> {
  title: string;
  queryKey: readonly unknown[];
  api: ResourceApi<T, never> | ResourceApi<T, Record<string, unknown>>;
  fields: FieldConfig[];
  headers: string[];
  row: (item: T) => ReactNode[];
}
