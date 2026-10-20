import { Inject, Injectable } from '@nestjs/common';
import type { CreateModelDto, ModelDto } from '@autos/contracts';
import { CrudService } from '../../../shared/application/crud.service.js';
import { slugify } from '../../../shared/domain/slug.js';
import { BrandsService } from '../../brands/application/brands.service.js';
import {
  MODEL_REPOSITORY, type ModelChanges, type ModelRepository, type NewModel,
} from './model.repository.js';

@Injectable()
export class ModelsService extends CrudService<ModelDto, NewModel, ModelChanges, CreateModelDto> {
  protected readonly entityName = 'Modelo';

  constructor(
    @Inject(MODEL_REPOSITORY) private readonly models: ModelRepository,
    private readonly brands: BrandsService,
  ) {
    super(models);
  }

  listByBrand(brandId?: string): Promise<ModelDto[]> {
    return brandId ? this.models.findByBrand(brandId) : this.list();
  }

  /** Valida que la marca exista y arma el slug "marca-modelo". */
  override async create(input: CreateModelDto): Promise<ModelDto> {
    const brand = await this.brands.get(input.brandId);
    return this.models.create({ ...input, slug: slugify(brand.slug, input.name) });
  }

  protected prepareCreate(input: CreateModelDto): NewModel {
    return { ...input, slug: slugify(input.name) };
  }
}
