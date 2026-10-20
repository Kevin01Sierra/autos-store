import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { setPriceSchema, type SetPriceDto } from '@autos/contracts';
import { Auth } from '../../../shared/auth/auth.decorators.js';
import { ZodValidationPipe } from '../../../shared/http/zod-validation.pipe.js';
import { PricingService } from '../application/pricing.service.js';

@ApiTags('Precios')
@Controller()
export class PricingController {
  constructor(private readonly pricing: PricingService) {}

  @Get('vehicles/:vehicleId/prices')
  history(@Param('vehicleId', ParseUUIDPipe) vehicleId: string) {
    return this.pricing.history(vehicleId);
  }

  @Post('vehicles/:vehicleId/prices')
  @Auth('admin')
  setPrice(
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Body(new ZodValidationPipe(setPriceSchema)) body: SetPriceDto,
  ) {
    return this.pricing.setPrice(vehicleId, body);
  }

  @Delete('prices/:priceId')
  @Auth('admin')
  @HttpCode(204)
  remove(@Param('priceId', ParseUUIDPipe) priceId: string) {
    return this.pricing.removeHistorical(priceId);
  }
}
