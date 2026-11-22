#!/usr/bin/env node
// Gate после сборки (docs/architecture/EXPORT-SUBPATHS.md, раздел 2.5):
// 1. `exports` не ссылается на файлы, которых нет в dist/;
// 2. публичные .d.ts не импортируют типы тяжёлых зависимостей.
import { existsSync, readdirSync, readFileSync } from 'node:fs';

// При выносе нового heavy-компонента (правило 2.2, зависимость не торчит в API) добавить пакет сюда.
const HEAVY_DEPENDENCIES = ['react-day-picker', 'date-fns', '@date-fns/tz'];

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const errors = [];

const collectPaths = (value, found = []) => {
  if (typeof value === 'string') {
    if (value.startsWith('./dist/')) found.push(value);
  } else if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) collectPaths(nested, found);
  }
  return found;
};

for (const path of new Set(collectPaths(pkg.exports))) {
  if (!existsSync(path)) errors.push(`exports ссылается на ${path}, но файла нет`);
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const heavyImport = new RegExp(
  `(?:from|import)\\s*\\(?\\s*['"](?:${HEAVY_DEPENDENCIES.map(escapeRegExp).join('|')})(?:/[^'"]*)?['"]`
);

for (const file of readdirSync('dist').filter((name) => /\.d\.c?ts$/.test(name))) {
  const match = readFileSync(`dist/${file}`, 'utf8').match(heavyImport);
  if (match) errors.push(`dist/${file}: в публичных типах торчит тяжёлая зависимость (${match[0].trim()})`);
}

if (errors.length > 0) {
  console.error(['verify-exports: найдены проблемы', ...errors.map((line) => `  - ${line}`)].join('\n'));
  process.exit(1);
}

console.log('verify-exports: ok');
