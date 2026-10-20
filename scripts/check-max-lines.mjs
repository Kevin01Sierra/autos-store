// Falla si algún archivo de código supera MAX_LINES líneas.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const MAX_LINES = 60;
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.sql', '.css', '.yml', '.yaml']);
const IGNORED_FILES = new Set(['pnpm-lock.yaml']);
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.turbo', 'coverage', '.git', '.vercel']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name) || IGNORED_FILES.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (CODE_EXTENSIONS.has(extname(name))) yield path;
  }
}

const offenders = [];
for (const file of walk(process.cwd())) {
  const lines = readFileSync(file, 'utf8').trimEnd().split('\n').length;
  if (lines > MAX_LINES) offenders.push(`${file}: ${lines} líneas`);
}

if (offenders.length > 0) {
  console.error(`Archivos con más de ${MAX_LINES} líneas:\n${offenders.join('\n')}`);
  process.exit(1);
}
console.log(`OK: ningún archivo supera ${MAX_LINES} líneas.`);
