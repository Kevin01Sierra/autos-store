// Función serverless de Vercel. Usa la salida compilada por `tsc` (dist/), que conserva
// la metadata de decoradores que necesita la inyección de dependencias de Nest.
import { createApp } from '../dist/bootstrap.js';

let handler;

export default async function vercelHandler(req, res) {
  if (!handler) {
    const app = await createApp();
    await app.init();
    handler = app.getHttpAdapter().getInstance();
  }
  return handler(req, res);
}
