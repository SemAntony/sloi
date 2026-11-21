import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseDeclarations } from '../../packages/tokens/scripts/check-contrast.mjs';

// D28: ссылка var(--sloi-*) на несуществующий токен молча даёт «нет значения»
// (так `--sloi-surface-muted` оставил DataTable bulkActions без фона). Ловим это тестом.
const tokensRoot = path.resolve(__dirname, '../../packages/tokens');
const uiRoot = path.resolve(__dirname, '../shared/ui');

const readTokens = (file: string) => fs.readFileSync(path.join(tokensRoot, file), 'utf8');
const globalTokens = new Set(
  ['src/palette.css', 'src/colors.css', 'src/tokens.css'].flatMap((file) =>
    Object.keys(parseDeclarations(readTokens(file)))
  )
);

function collectScss(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectScss(full);
    return entry.name.endsWith('.scss') && !entry.name.includes('.stories.') ? [full] : [];
  });
}

describe('SCSS компонентов: ссылки на токены', () => {
  const files = collectScss(uiRoot);

  it('находит SCSS-файлы компонентов', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('каждый var(--sloi-*) объявлен в токенах или локально в том же файле', () => {
    const missing: string[] = [];
    for (const file of files) {
      const css = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      const local = new Set(Object.keys(parseDeclarations(css)));
      for (const match of css.matchAll(/var\((--sloi-[a-z0-9-]+)/g)) {
        const name = match[1];
        if (!globalTokens.has(name) && !local.has(name)) {
          missing.push(`${path.relative(uiRoot, file)}: ${name}`);
        }
      }
    }
    expect([...new Set(missing)]).toEqual([]);
  });
});
