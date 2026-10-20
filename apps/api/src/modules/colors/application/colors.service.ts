import { Inject, Injectable } from '@nestjs/common';
import type { ColorDto, CreateColorDto, UpdateColorDto } from '@autos/contracts';
import { CrudService } from '../../../shared/application/crud.service.js';
import { COLOR_REPOSITORY, type ColorRepository } from './color.repository.js';

@Injectable()
export class ColorsService extends CrudService<ColorDto, CreateColorDto, UpdateColorDto> {
  protected readonly entityName = 'Color';

  constructor(@Inject(COLOR_REPOSITORY) repository: ColorRepository) {
    super(repository);
  }

  protected prepareCreate(input: CreateColorDto): CreateColorDto {
    return { ...input, hex: input.hex.toUpperCase() };
  }
}
