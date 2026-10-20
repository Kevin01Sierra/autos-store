// Copia los archivos de Swagger UI a dist/ para que Vercel los incluya en la función serverless.
import { cpSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const source = require('swagger-ui-dist').getAbsoluteFSPath();
const target = resolve(import.meta.dirname, '../dist/swagger-ui');

cpSync(source, target, { recursive: true, filter: (file) => !file.endsWith('.map') });
