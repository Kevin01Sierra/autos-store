import { Inject, Injectable } from '@nestjs/common';
import type { BrandDto, CreateBrandDto } from '@autos/contracts';
import { CrudService } from '../../../shared/application/crud.service.js';
import { slugify } from '../../../shared/domain/slug.js';
import {
  BRAND_REPOSITORY, type BrandChanges, type BrandRepository, type NewBrand,
} from './brand.repository.js';

@Injectable()
export class BrandsService extends CrudService<BrandDto, NewBrand, BrandChanges, CreateBrandDto> {
  protected readonly entityName = 'Marca';

  constructor(@Inject(BRAND_REPOSITORY) repository: BrandRepository) {
    super(repository);
  }

  protected prepareCreate(input: CreateBrandDto): NewBrand {
    return { ...input, slug: slugify(input.name) };
  }

  protected override prepareUpdate(input: BrandChanges): BrandChanges {
    return input.name ? { ...input, slug: slugify(input.name) } : input;
  }
}
