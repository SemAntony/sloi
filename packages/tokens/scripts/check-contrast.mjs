#!/usr/bin/env node
/**
 * Проверка контраста по токенам (A3 / D25).
 *
 * Читает палитру и семантические токены из CSS, раскрывает var()/color-mix до цвета
 * для каждой темы (`:root` = light, `[data-theme='x']` = x) и проверяет пары из
 * `contrast-pairs.json` по WCAG 2.2 (1.4.3 текст, 1.4.11 нетекстовые элементы).
 * Темы берутся из данных: новая тема в colors.css проверяется без правки скрипта.
 *
 * Запуск: node scripts/check-contrast.mjs [--all] [--json <путь>]
 * Код выхода: 1, если есть непредвиденный провал или устаревшая запись в knownFailures.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(scriptsDir, '../src');
const DEFAULT_CONFIG = path.join(scriptsDir, 'contrast-pairs.json');

const declarationPattern = /(--sloi-[a-z0-9-]+)\s*:\s*([^;]+);/gi;

export function parseDeclarations(css) {
  return Object.fromEntries(
    [...css.matchAll(declarationPattern)].map((match) => [match[1], match[2].trim()])
  );
}

/** Возвращает { light: {...}, dark: {...} }: только объявленное в самом блоке, без наследования. */
export function parseThemeBlocks(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import[^;]+;/g, '');
  const blocks = {};
  for (const match of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1].trim();
    const themeMatch = selector.match(/^\[data-theme=['"]([\w-]+)['"]\]$/);
    const name = selector === ':root' ? 'light' : themeMatch?.[1];
    if (name) {
      blocks[name] = { ...blocks[name], ...parseDeclarations(match[2]) };
    }
  }
  return blocks;
}

/** Итоговые переменные темы: палитра + :root + переопределения темы (data-theme на корневом элементе). */
export function buildThemes(paletteCss, colorsCss) {
  const palette = parseDeclarations(paletteCss);
  const blocks = parseThemeBlocks(colorsCss);
  const base = { ...palette, ...blocks.light };
  return Object.fromEntries(
    Object.entries(blocks).map(([name, own]) => [
      name,
      name === 'light' ? base : { ...base, ...own }
    ])
  );
}

function splitTopLevel(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

function parseHex(hex) {
  const digits = hex.slice(1);
  const full =
    digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits;
  if (!/^[0-9a-f]{6}$/i.test(full)) {
    throw new Error(`Неподдерживаемый hex-цвет: ${hex}`);
  }
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return { r, g, b, a: 1 };
}

function mixSrgb(argument, vars, seen) {
  const parts = splitTopLevel(argument);
  if (parts[0] !== 'in srgb' || parts.length !== 3) {
    throw new Error(`Поддерживается только color-mix(in srgb, A, B): ${argument}`);
  }
  const stops = parts.slice(1).map((part) => {
    const match = part.match(/^(.*?)(?:\s+([\d.]+)%)?$/s);
    return {
      color: resolveColor(match[1], vars, seen),
      percent: match[2] === undefined ? undefined : Number(match[2])
    };
  });
  let [first, second] = stops;
  if (first.percent === undefined && second.percent === undefined) {
    first = { ...first, percent: 50 };
    second = { ...second, percent: 50 };
  } else if (first.percent === undefined) {
    first = { ...first, percent: 100 - second.percent };
  } else if (second.percent === undefined) {
    second = { ...second, percent: 100 - first.percent };
  }
  const total = first.percent + second.percent;
  const w1 = first.percent / total;
  const w2 = second.percent / total;
  const alpha = w1 * first.color.a + w2 * second.color.a;
  const channel = (key) =>
    alpha === 0
      ? 0
      : (w1 * first.color[key] * first.color.a + w2 * second.color[key] * second.color.a) / alpha;
  return {
    r: channel('r'),
    g: channel('g'),
    b: channel('b'),
    a: alpha * Math.min(total, 100) / 100
  };
}

/** Раскрывает значение токена до { r, g, b, a } (0-255, a 0-1). */
export function resolveColor(value, vars, seen = new Set()) {
  const text = value.trim().replace(/\s+/g, ' ');
  if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (text.startsWith('#')) return parseHex(text);

  const variable = text.match(/^var\((--[\w-]+)\)$/);
  if (variable) {
    const name = variable[1];
    if (seen.has(name)) throw new Error(`Циклическая ссылка: ${name}`);
    if (!(name in vars)) throw new Error(`Токен не найден: ${name}`);
    return resolveColor(vars[name], vars, new Set([...seen, name]));
  }

  const mix = text.match(/^color-mix\((.*)\)$/s);
  if (mix) return mixSrgb(mix[1], vars, seen);

  throw new Error(`Не цвет или не поддерживается: ${text}`);
}

export function compose(top, backdrop) {
  const a = top.a + backdrop.a * (1 - top.a);
  const mixChannel = (key) =>
    a === 0 ? 0 : (top[key] * top.a + backdrop[key] * backdrop.a * (1 - top.a)) / a;
  return { r: mixChannel('r'), g: mixChannel('g'), b: mixChannel('b'), a };
}

function luminance({ r, g, b }) {
  const linear = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

export function expandPairs(config) {
  const list = (single, many) => (many ?? [single]).filter(Boolean);
  return config.pairs.flatMap((pair) =>
    list(pair.fg, pair.fgs).flatMap((fg) =>
      list(pair.bg, pair.bgs).map((bg) => ({
        fg,
        bg,
        min: pair.min,
        kind: pair.kind,
        level: pair.level ?? 'required',
        over: pair.over,
        why: pair.why
      }))
    )
  );
}

const pairKey = (theme, fg, bg) => `${theme}|${fg}|${bg}`;

function evaluatePair(pair, vars) {
  const backdrop = pair.over ? resolveColor(`var(${pair.over})`, vars) : undefined;
  let background = resolveColor(`var(${pair.bg})`, vars);
  if (background.a < 1) {
    if (!backdrop) throw new Error(`Фон ${pair.bg} полупрозрачный, нужен "over"`);
    background = compose(background, backdrop);
  }
  let foreground = resolveColor(`var(${pair.fg})`, vars);
  if (foreground.a < 1) foreground = compose(foreground, background);
  return contrastRatio(foreground, background);
}

export function runChecks(themes, config) {
  const pairs = expandPairs(config);
  const known = new Map(
    (config.knownFailures ?? []).map((entry) => [pairKey(entry.theme, entry.fg, entry.bg), entry])
  );
  const seenKnown = new Set();
  const results = [];

  for (const [theme, vars] of Object.entries(themes)) {
    for (const pair of pairs) {
      const key = pairKey(theme, pair.fg, pair.bg);
      let ratio;
      let error;
      try {
        ratio = evaluatePair(pair, vars);
      } catch (caught) {
        error = caught.message;
      }
      const passed = ratio !== undefined && ratio >= pair.min;
      let status = 'pass';
      if (error) status = 'error';
      else if (!passed && known.has(key)) status = 'known';
      else if (!passed && pair.level === 'advisory') status = 'advisory';
      else if (!passed) status = 'fail';
      if (known.has(key)) seenKnown.add(key);
      results.push({ theme, ...pair, ratio, error, status, ref: known.get(key)?.ref });
    }
  }

  const stale = [...known.entries()]
    .filter(([key]) => {
      const result = results.find((r) => pairKey(r.theme, r.fg, r.bg) === key);
      return !result || result.status === 'pass';
    })
    .map(([, entry]) => entry);

  const covered = new Set(pairs.flatMap((p) => [p.fg, p.bg, p.over].filter(Boolean)));
  const exempt = new Set((config.exemptions ?? []).map((e) => e.token));
  const uncovered = Object.keys(themes.light ?? {}).filter((token) => {
    if (token.startsWith('--sloi-palette-') || covered.has(token) || exempt.has(token)) {
      return false;
    }
    try {
      resolveColor(`var(${token})`, themes.light);
      return true;
    } catch {
      return false;
    }
  });

  return { results, stale, uncovered };
}

const floor2 = (value) => (Math.floor(value * 100) / 100).toFixed(2);
const short = (token) => token.replace('--sloi-', '');

export function formatReport({ results, stale, uncovered }, { showAll = false } = {}) {
  const lines = [];
  for (const theme of [...new Set(results.map((r) => r.theme))]) {
    const rows = results.filter((r) => r.theme === theme);
    const count = (status) => rows.filter((r) => r.status === status).length;
    lines.push(
      `\n[${theme}] пар: ${rows.length}, ok: ${count('pass')}, FAIL: ${count('fail')}, ` +
        `известные: ${count('known')}, advisory: ${count('advisory')}, ошибки: ${count('error')}`
    );
    for (const row of rows.filter((r) => showAll || r.status !== 'pass')) {
      const value = row.ratio === undefined ? 'n/a ' : floor2(row.ratio);
      const note = row.error ?? (row.ref ? `см. ${row.ref}` : '');
      lines.push(
        `  ${row.status.toUpperCase().padEnd(8)} ${value.padStart(5)}:1 < ${String(row.min).padEnd(3)} ` +
          `${short(row.fg)} на ${short(row.bg)} ${note}`.trimEnd()
      );
    }
  }
  for (const entry of stale) {
    lines.push(`\nУСТАРЕЛО: ${entry.theme} ${short(entry.fg)} на ${short(entry.bg)} уже проходит или удалена из пар; уберите из knownFailures`);
  }
  if (uncovered.length > 0) {
    lines.push(`\nТокены без пары (добавьте пару или exemption): ${uncovered.map(short).join(', ')}`);
  }
  return lines.join('\n');
}

export function loadAndRun(configPath = DEFAULT_CONFIG) {
  const read = (name) => fs.readFileSync(path.join(srcDir, name), 'utf8');
  const themes = buildThemes(read('palette.css'), read('colors.css'));
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return runChecks(themes, config);
}

export function hasFailures({ results, stale }) {
  return stale.length > 0 || results.some((r) => r.status === 'fail' || r.status === 'error');
}

function main() {
  const args = process.argv.slice(2);
  const outcome = loadAndRun();
  console.log(formatReport(outcome, { showAll: args.includes('--all') }));
  const jsonIndex = args.indexOf('--json');
  if (jsonIndex !== -1 && args[jsonIndex + 1]) {
    fs.writeFileSync(args[jsonIndex + 1], JSON.stringify(outcome, null, 2));
  }
  process.exit(hasFailures(outcome) ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
