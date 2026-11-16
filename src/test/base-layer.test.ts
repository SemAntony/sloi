import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseDeclarations } from '../../packages/tokens/scripts/check-contrast.mjs';

const tokensRoot = path.resolve(__dirname, '../../packages/tokens');
const read = (file: string) => fs.readFileSync(path.join(tokensRoot, file), 'utf8');

const baseCss = read('src/base.css').replace(/\/\*[\s\S]*?\*\//g, '');
const rules = [...baseCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
  selector: match[1].trim(),
  body: match[2]
}));

describe('base.css (P5, D41): необязательный базовый слой', () => {
  it('содержит правила', () => {
    expect(rules.length).toBeGreaterThan(0);
  });

  it('все селекторы обёрнуты в :where(): нулевая специфичность, стили приложения побеждают без !important', () => {
    for (const { selector } of rules) {
      expect(selector, selector).toMatch(/^:where\(/);
    }
    expect(baseCss).not.toContain('!important');
  });

  it('использует только существующие токены', () => {
    const known = new Set(
      ['src/palette.css', 'src/colors.css', 'src/tokens.css'].flatMap((file) =>
        Object.keys(parseDeclarations(read(file)))
      )
    );
    const used = [...baseCss.matchAll(/var\((--sloi-[a-z0-9-]+)\)/g)].map((match) => match[1]);

    expect(used.length).toBeGreaterThan(0);
    for (const token of used) {
      expect(known.has(token), token).toBe(true);
    }
  });

  it('задаёт шрифт страницы из токена, а не из жёсткого списка шрифтов', () => {
    const body = rules.find((rule) => rule.selector === ':where(body)');
    expect(body?.body).toContain('font-family: var(--sloi-font-family-sans)');
  });

  it('base.css не входит в styles.css (подключается явно) и экспортируется из обоих пакетов', () => {
    expect(read('src/styles.css')).not.toContain('base.css');

    const tokensPackage = JSON.parse(read('package.json'));
    expect(tokensPackage.exports['./css/base.css']).toBe('./src/base.css');

    const rootPackage = JSON.parse(fs.readFileSync(path.resolve(tokensRoot, '../../package.json'), 'utf8'));
    expect(rootPackage.exports['./base.css']).toBe('./dist/base.css');
  });
});
