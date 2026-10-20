import type { BrandDto, CreateBrandDto, UpdateBrandDto } from '@autos/contracts';
import type { CrudRepository } from '../../../shared/application/crud.repository.js';

export type NewBrand = CreateBrandDto & { slug: string };
export type BrandChanges = UpdateBrandDto & { slug?: string };
export type BrandRepository = CrudRepository<BrandDto, NewBrand, BrandChanges>;

export const BRAND_REPOSITORY = Symbol('BRAND_REPOSITORY');
