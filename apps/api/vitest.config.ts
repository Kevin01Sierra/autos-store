import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC conserva la metadata de decoradores que necesita la inyección de dependencias de Nest.
export default defineConfig({
  test: { globals: false, include: ['test/**/*.spec.ts'], environment: 'node' },
  plugins: [swc.vite({ module: { type: 'es6' } })],
});
