import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  createBrandSchema, updateBrandSchema, type CreateBrandDto, type UpdateBrandDto,
} from '@autos/contracts';
import { Auth } from '../../../shared/auth/auth.decorators.js';
import { ZodValidationPipe } from '../../../shared/http/zod-validation.pipe.js';
import { BrandsService } from '../application/brands.service.js';

@ApiTags('Marcas')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brands: BrandsService) {}

  @Get()
  list() {
    return this.brands.list();
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.brands.get(id);
  }

  @Post()
  @Auth('admin')
  create(@Body(new ZodValidationPipe(createBrandSchema)) body: CreateBrandDto) {
    return this.brands.create(body);
  }

  @Patch(':id')
  @Auth('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateBrandSchema)) body: UpdateBrandDto,
  ) {
    return this.brands.update(id, body);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brands.remove(id);
  }
}
