import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { parseThemeBlocks } from '../../packages/tokens/scripts/check-contrast.mjs';

const tokensRoot = path.resolve(__dirname, '../../packages/tokens');
const CSS_FILES = ['palette.css', 'colors.css', 'tokens.css'] as const;

const normalizeCss = (value: string) =>
  value.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();

const normalizeBlocks = (css: string) =>
  Object.fromEntries(
    Object.entries(parseThemeBlocks(css)).map(([theme, declarations]) => [
      theme,
      Object.fromEntries(
        Object.entries(declarations as Record<string, string>).map(([name, value]) => [
          name,
          normalizeCss(value)
        ])
      )
    ])
  );

const imports = (css: string) => [...css.matchAll(/@import\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);

describe('tokens: DTCG source и артефакты в src (A2c/A2d)', () => {
  let outDir: string;

  beforeAll(() => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sloi-tokens-'));
    // отдельный процесс: сборка использует Node API и не должна зависеть от jsdom-окружения тестов
    execFileSync(process.execPath, [path.join(tokensRoot, 'scripts/build-tokens.mjs'), '--out', outDir], {
      stdio: 'pipe'
    });
  }, 60_000);

  afterAll(() => {
    fs.rmSync(outDir, { recursive: true, force: true });
  });

  for (const file of CSS_FILES) {
    it(`${file}: те же селекторы, имена и значения`, () => {
      const current = fs.readFileSync(path.join(tokensRoot, 'src', file), 'utf8');
      const generated = fs.readFileSync(path.join(outDir, file), 'utf8');
      expect(normalizeBlocks(generated)).toEqual(normalizeBlocks(current));
      expect(imports(generated)).toEqual(imports(current));
    });
  }

  it('артефакты в packages/tokens/src свежие: побайтово совпадают со сборкой из source/ (запустите pnpm tokens:build)', () => {
    for (const file of [...CSS_FILES, 'tokens.json', 'tokens.dark.json', 'tokens.js', 'tokens.d.ts']) {
      const committed = fs.readFileSync(path.join(tokensRoot, 'src', file), 'utf8');
      expect(fs.readFileSync(path.join(outDir, file), 'utf8'), file).toBe(committed);
    }
  });

  it('tokens.json это DTCG: у каждого листа есть $value, у не-алиасов есть $type, алиасы указывают на существующие токены', () => {
    const doc = JSON.parse(fs.readFileSync(path.join(outDir, 'tokens.json'), 'utf8'));
    const dark = JSON.parse(fs.readFileSync(path.join(outDir, 'tokens.dark.json'), 'utf8'));
    const leaves = new Map<string, Record<string, unknown>>();

    const walk = (node: Record<string, unknown>, trail: string[]) => {
      for (const [key, child] of Object.entries(node)) {
        if (key.startsWith('$')) continue;
        const value = child as Record<string, unknown>;
        if ('$value' in value) leaves.set([...trail, key].join('.'), value);
        else walk(value, [...trail, key]);
      }
    };
    walk(doc, []);
    expect(leaves.size).toBe(242 + 47 + 57);

    for (const [tokenPath, token] of leaves) {
      const isAlias = typeof token.$value === 'string' && /^\{.+\}$/.test(token.$value);
      if (!isAlias) expect(token.$type, tokenPath).toBeTypeOf('string');
    }

    const darkLeaves = new Map<string, Record<string, unknown>>();
    const collect = (node: Record<string, unknown>, trail: string[]) => {
      for (const [key, child] of Object.entries(node)) {
        if (key.startsWith('$')) continue;
        const value = child as Record<string, unknown>;
        if ('$value' in value) darkLeaves.set([...trail, key].join('.'), value);
        else collect(value, [...trail, key]);
      }
    };
    collect(dark, []);
    expect(darkLeaves.size).toBe(46);

    for (const token of [...leaves.values(), ...darkLeaves.values()]) {
      const match = typeof token.$value === 'string' ? token.$value.match(/^\{(.+)\}$/) : null;
      if (match) expect(leaves.has(match[1]), `ссылка ${match[1]}`).toBe(true);
    }
    for (const tokenPath of darkLeaves.keys()) {
      expect(leaves.has(tokenPath), `dark-переопределение ${tokenPath} без light-токена`).toBe(true);
    }
  });
});
