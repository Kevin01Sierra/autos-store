import { Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CronSecretGuard } from '../../../shared/http/cron-secret.guard.js';
import { MarketDataService } from '../application/market-data.service.js';

@ApiTags('Mercado')
@Controller('market')
export class MarketController {
  constructor(private readonly market: MarketDataService) {}

  @Get('top')
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'color', required: false })
  top(
    @Query('brand') brand?: string,
    @Query('color') color?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.market.topModels({ brand, color, limit: Math.min(limit, 50) });
  }

  @Post('sync')
  @UseGuards(CronSecretGuard)
  @ApiHeader({ name: 'x-cron-secret', required: true })
  sync() {
    return this.market.sync();
  }
}
