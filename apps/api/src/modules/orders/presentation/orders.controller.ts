import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  changeOrderStatusSchema, purchaseSchema, type ChangeOrderStatusDto, type PurchaseDto,
} from '@autos/contracts';
import type { AuthUser } from '../../../shared/auth/auth-user.js';
import { Auth, CurrentUser } from '../../../shared/auth/auth.decorators.js';
import { ZodValidationPipe } from '../../../shared/http/zod-validation.pipe.js';
import { OrdersService } from '../application/orders.service.js';
import { PurchaseFacade } from '../application/purchase.facade.js';

@ApiTags('Pedidos')
@Controller('orders')
@Auth()
export class OrdersController {
  constructor(
    private readonly purchases: PurchaseFacade,
    private readonly orders: OrdersService,
  ) {}

  @Post()
  purchase(
    @Body(new ZodValidationPipe(purchaseSchema)) body: PurchaseDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.purchases.purchase(body, user);
  }

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.orders.list(user);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.orders.get(id, user);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(changeOrderStatusSchema)) body: ChangeOrderStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.orders.changeStatus(id, body.status, user);
  }
}
