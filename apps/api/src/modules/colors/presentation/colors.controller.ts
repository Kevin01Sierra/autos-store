import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  createColorSchema, updateColorSchema, type CreateColorDto, type UpdateColorDto,
} from '@autos/contracts';
import { Auth } from '../../../shared/auth/auth.decorators.js';
import { ZodValidationPipe } from '../../../shared/http/zod-validation.pipe.js';
import { ColorsService } from '../application/colors.service.js';

@ApiTags('Colores')
@Controller('colors')
export class ColorsController {
  constructor(private readonly colors: ColorsService) {}

  @Get()
  list() {
    return this.colors.list();
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.colors.get(id);
  }

  @Post()
  @Auth('admin')
  create(@Body(new ZodValidationPipe(createColorSchema)) body: CreateColorDto) {
    return this.colors.create(body);
  }

  @Patch(':id')
  @Auth('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateColorSchema)) body: UpdateColorDto,
  ) {
    return this.colors.update(id, body);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.colors.remove(id);
  }
}
