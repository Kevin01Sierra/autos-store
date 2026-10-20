import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { timingSafeEqual } from 'node:crypto';

/** Protege endpoints que invoca un job programado (GitHub Actions) con un secreto compartido. */
@Injectable()
export class CronSecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const header = context.switchToHttp().getRequest<Request>().headers['x-cron-secret'];
    const expected = Buffer.from(this.config.getOrThrow<string>('CRON_SECRET'));
    const received = Buffer.from(typeof header === 'string' ? header : '');
    if (received.length === expected.length && timingSafeEqual(received, expected)) return true;
    throw new UnauthorizedException('Secreto de cron inválido');
  }
}
