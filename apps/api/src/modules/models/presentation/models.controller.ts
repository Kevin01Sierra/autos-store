import {
  Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  createModelSchema, updateModelSchema, type CreateModelDto, type UpdateModelDto,
} from '@autos/contracts';
import { Auth } from '../../../shared/auth/auth.decorators.js';
import { ZodValidationPipe } from '../../../shared/http/zod-validation.pipe.js';
import { ModelsService } from '../application/models.service.js';

@ApiTags('Modelos')
@Controller('models')
export class ModelsController {
  constructor(private readonly models: ModelsService) {}

  @Get()
  @ApiQuery({ name: 'brandId', required: false })
  list(@Query('brandId', new ParseUUIDPipe({ optional: true })) brandId?: string) {
    return this.models.listByBrand(brandId);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.models.get(id);
  }

  @Post()
  @Auth('admin')
  create(@Body(new ZodValidationPipe(createModelSchema)) body: CreateModelDto) {
    return this.models.create(body);
  }

  @Patch(':id')
  @Auth('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateModelSchema)) body: UpdateModelDto,
  ) {
    return this.models.update(id, body);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.models.remove(id);
  }
}
