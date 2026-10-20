import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { DomainErrorFilter } from './shared/http/domain-error.filter.js';

/** Configuración compartida por el servidor local y la función serverless de Vercel. */
export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const origins = app.get(ConfigService).getOrThrow<string>('CORS_ORIGINS').split(',');
  app.enableCors({ origin: origins });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new DomainErrorFilter());
  const docs = new DocumentBuilder()
    .setTitle('Autos Store API')
    .setDescription('Catálogo, inventario, compras y recomendaciones de vehículos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, docs), swaggerUiOptions());
  return app;
}

/** En Vercel los archivos de Swagger UI viajan dentro de dist/ (los copia el build). */
function swaggerUiOptions() {
  const bundled = resolve(import.meta.dirname, 'swagger-ui');
  return existsSync(bundled) ? { customSwaggerUiPath: bundled } : {};
}
