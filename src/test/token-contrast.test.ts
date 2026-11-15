import { describe, expect, it } from 'vitest';
import {
  buildThemes,
  contrastRatio,
  formatReport,
  hasFailures,
  loadAndRun,
  resolveColor,
  runChecks
} from '../../packages/tokens/scripts/check-contrast.mjs';

const white = { r: 255, g: 255, b: 255, a: 1 };
const black = { r: 0, g: 0, b: 0, a: 1 };

describe('token contrast: math and resolution', () => {
  it('считает чёрное на белом как 21:1 и симметрично', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5);
    expect(contrastRatio(white, black)).toBeCloseTo(21, 5);
  });

  it('раскрывает цепочку var() до hex', () => {
    const vars = { '--a': 'var(--b)', '--b': '#336699' };
    expect(resolveColor('var(--a)', vars)).toEqual({ r: 51, g: 102, b: 153, a: 1 });
  });

  it('color-mix с transparent даёт альфу, равную доле цвета', () => {
    const vars = { '--c': '#000000' };
    const mixed = resolveColor('color-mix(in srgb, var(--c) 40%, transparent)', vars);
    expect(mixed.a).toBeCloseTo(0.4, 5);
    expect(mixed.r).toBe(0);
  });

  it('color-mix двух непрозрачных цветов смешивает по долям', () => {
    const mixed = resolveColor('color-mix(in srgb, #000000 50%, #ffffff)', {});
    expect(mixed.r).toBeCloseTo(127.5, 5);
    expect(mixed.a).toBe(1);
  });

  it('падает на циклической ссылке и неизвестном токене', () => {
    expect(() => resolveColor('var(--a)', { '--a': 'var(--a)' })).toThrow(/Цикл/);
    expect(() => resolveColor('var(--none)', {})).toThrow(/не найден/);
  });

  it('берёт темы из данных: новая [data-theme] появляется без правки кода', () => {
    const themes = buildThemes(
      ':root { --sloi-palette-a: #ffffff; --sloi-palette-b: #000000; }',
      ":root { --sloi-x: var(--sloi-palette-a); } [data-theme='hc'] { --sloi-x: var(--sloi-palette-b); }"
    );
    expect(Object.keys(themes)).toEqual(['light', 'hc']);
    expect(resolveColor('var(--sloi-x)', themes.hc)).toEqual(black);
  });

  it('падение пары не из knownFailures даёт FAIL, а запись, которая уже проходит, помечается устаревшей', () => {
    const themes = {
      light: { '--sloi-fg': '#777777', '--sloi-bg': '#ffffff', '--sloi-ok': '#000000' }
    };
    const config = {
      pairs: [
        { fg: '--sloi-fg', bg: '--sloi-bg', min: 4.5, kind: 'text' },
        { fg: '--sloi-ok', bg: '--sloi-bg', min: 4.5, kind: 'text' }
      ],
      knownFailures: [{ theme: 'light', fg: '--sloi-ok', bg: '--sloi-bg', ref: 'X' }]
    };
    const outcome = runChecks(themes, config);
    expect(outcome.results.find((r) => r.fg === '--sloi-fg')?.status).toBe('fail');
    expect(outcome.stale).toHaveLength(1);
    expect(hasFailures(outcome)).toBe(true);
  });
});

describe('token contrast: реальные токены @sloi/tokens', () => {
  const outcome = loadAndRun();

  it('проверяет и light, и dark', () => {
    expect(new Set(outcome.results.map((r) => r.theme))).toEqual(new Set(['light', 'dark']));
  });

  it('нет непредвиденных провалов и устаревших записей knownFailures', () => {
    expect(hasFailures(outcome), formatReport(outcome)).toBe(false);
  });

  it('все семантические цветовые токены покрыты парой или exemption', () => {
    expect(outcome.uncovered).toEqual([]);
  });
});
