import type { CreateModelDto, ModelDto, UpdateModelDto } from '@autos/contracts';
import type { CrudRepository } from '../../../shared/application/crud.repository.js';

export type NewModel = CreateModelDto & { slug: string };
export type ModelChanges = UpdateModelDto & { slug?: string };

export interface ModelRepository extends CrudRepository<ModelDto, NewModel, ModelChanges> {
  findByBrand(brandId: string): Promise<ModelDto[]>;
}

export const MODEL_REPOSITORY = Symbol('MODEL_REPOSITORY');
