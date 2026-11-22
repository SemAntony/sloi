#!/usr/bin/env node
// После vite build: CJS-типы и необязательный base-слой (@sloi/ui-kit/base.css).
// Список входов совпадает с build.lib.entry в vite.config.ts и с `exports` в package.json.
import { copyFileSync, existsSync } from 'node:fs';

const entries = ['index', 'date-picker', 'data-table-v2'];

for (const name of entries) {
  const source = `dist/${name}.d.ts`;
  if (!existsSync(source)) {
    throw new Error(`post-build: нет ${source}; вход есть в vite.config.ts, но dts его не собрал`);
  }
  copyFileSync(source, `dist/${name}.d.cts`);
}

copyFileSync('packages/tokens/src/base.css', 'dist/base.css');
