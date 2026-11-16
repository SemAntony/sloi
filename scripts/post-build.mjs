#!/usr/bin/env node
// После vite build: CJS-типы и необязательный base-слой (@sloi/ui-kit/base.css).
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.d.ts', 'dist/index.d.cts');
copyFileSync('packages/tokens/src/base.css', 'dist/base.css');
