import type { ColorDto, CreateColorDto, UpdateColorDto } from '@autos/contracts';
import type { CrudRepository } from '../../../shared/application/crud.repository.js';

export type ColorRepository = CrudRepository<ColorDto, CreateColorDto, UpdateColorDto>;

export const COLOR_REPOSITORY = Symbol('COLOR_REPOSITORY');
