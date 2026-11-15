#!/usr/bin/env node
/**
 * A2a: разовая миграция CSS-токенов в DTCG-файлы (packages/tokens/source/).
 *
 * Читает palette.css, colors.css, tokens.css и пишет:
 *   source/primitives/palette.json  palette.<hue>.<step>
 *   source/foundation.json          space, radius, size, font, motion
 *   source/semantic/light.json      :root из colors.css
 *   source/semantic/dark.json       [data-theme='dark'] из colors.css (только переопределения)
 *
 * Соглашения:
 *  - Имя CSS = `--sloi-` + путь токена через дефис (обратимо, проверяется на каждом токене).
 *  - Цвета: hex-строки. Алиасы: {path.to.token}.
 *  - color-mix и ключевые слова easing не выражаются в DTCG: $value хранит эквивалент
 *    (hex с альфой, cubic-bezier), а точная CSS-строка лежит в $extensions["sloi.css"].
 *  - Неизвестное значение или имя без правила: ошибка, ничего не теряется молча.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildThemes, parseDeclarations, parseThemeBlocks, resolveColor } from './check-contrast.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const outDir = path.join(root, 'source');
const EXT = 'sloi.css';

export function pathFor(name) {
  const bare = name.replace(/^--sloi-/, '');
  const rules = [
    [/^palette-([a-z]+)-(\d+)$/, (m) => ['palette', m[1], m[2]]],
    [/^space-(.+)$/, (m) => ['space', m[1]]],
    [/^radius-(.+)$/, (m) => ['radius', m[1]]],
    [/^size-control-(.+)$/, (m) => ['size', 'control', m[1]]],
    [/^font-(family|size|line|weight)-(.+)$/, (m) => ['font', m[1], m[2]]],
    [/^motion-(duration|easing)-(.+)$/, (m) => ['motion', m[1], m[2]]],
    [
      /^(surface|text|border|focus|interactive|field|status|accent|overlay|shadow)-(.+)$/,
      (m) => [m[1], m[2]]
    ]
  ];
  for (const [pattern, toPath] of rules) {
    const match = bare.match(pattern);
    if (match) {
      const result = toPath(match);
      if (['--sloi', ...result].join('-') !== name) throw new Error(`Имя необратимо: ${name}`);
      return result;
    }
  }
  throw new Error(`Нет правила имени для ${name}`);
}

const toHex = ({ r, g, b, a }) => {
  const h = (value) => Math.round(value).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}${a >= 1 ? '' : h(a * 255)}`;
};

const normalize = (value) =>
  value.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();
const number = (text) => Number(text);

function convertFoundation(name, raw) {
  const value = normalize(raw);
  const bare = name.replace(/^--sloi-/, '');
  const alias = value.match(/^var\((--sloi-[a-z0-9-]+)\)$/);
  if (alias) return { $value: `{${pathFor(alias[1]).join('.')}}` };

  let m;
  if (/^(space|radius|size-control)-/.test(bare)) {
    if ((m = value.match(/^(-?[\d.]+)rem$/))) {
      return { $type: 'dimension', $value: { value: number(m[1]), unit: 'rem' } };
    }
    if (value === '0') return { $type: 'dimension', $value: { value: 0, unit: 'px' } };
  }
  if (/^font-size-/.test(bare) && (m = value.match(/^(-?[\d.]+)rem$/))) {
    return { $type: 'dimension', $value: { value: number(m[1]), unit: 'rem' } };
  }
  if (/^font-line-/.test(bare) && /^[\d.]+$/.test(value)) {
    return { $type: 'number', $value: number(value) };
  }
  if (/^font-weight-/.test(bare) && /^\d+$/.test(value)) {
    return { $type: 'fontWeight', $value: number(value) };
  }
  if (bare === 'font-family-sans') {
    const names = value.split(',').map((part) => part.trim().replace(/^'(.*)'$/, '$1'));
    return { $type: 'fontFamily', $value: names };
  }
  if (/^motion-duration-/.test(bare) && (m = value.match(/^(\d+)ms$/))) {
    return { $type: 'duration', $value: { value: number(m[1]), unit: 'ms' } };
  }
  if (/^motion-easing-/.test(bare)) {
    const keywords = {
      ease: [0.25, 0.1, 0.25, 1],
      'ease-in': [0.42, 0, 1, 1],
      'ease-out': [0, 0, 0.58, 1]
    };
    if (keywords[value]) {
      return { $type: 'cubicBezier', $value: keywords[value], $extensions: { [EXT]: value } };
    }
    if ((m = value.match(/^cubic-bezier\(([^)]+)\)$/))) {
      return { $type: 'cubicBezier', $value: m[1].split(',').map(number) };
    }
  }
  throw new Error(`Неизвестное foundation-значение: ${name}: ${raw}`);
}

function convertColorLike(name, raw, vars) {
  const value = normalize(raw);
  const alias = value.match(/^var\((--sloi-[a-z0-9-]+)\)$/);
  if (alias) return { $value: `{${pathFor(alias[1]).join('.')}}` };
  if (/^#[0-9a-f]{3,8}$/i.test(value)) return { $type: 'color', $value: value.toLowerCase() };
  if (/^color-mix\(.*\)$/.test(value)) {
    return {
      $type: 'color',
      $value: toHex(resolveColor(value, vars)),
      $extensions: { [EXT]: value }
    };
  }
  const shadow = value.match(
    /^(-?[\d.]+)(?:px)? (-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px (color-mix\(.*\))$/
  );
  if (shadow) {
    const px = (text) => ({ value: number(text), unit: 'px' });
    return {
      $type: 'shadow',
      $value: {
        color: toHex(resolveColor(shadow[5], vars)),
        offsetX: px(shadow[1]),
        offsetY: px(shadow[2]),
        blur: px(shadow[3]),
        spread: px(shadow[4])
      },
      $extensions: { [EXT]: value }
    };
  }
  throw new Error(`Неизвестное значение: ${name}: ${raw}`);
}

function toTree(entries, convert) {
  const tree = {};
  for (const [name, raw] of entries) {
    const segments = pathFor(name);
    let node = tree;
    for (const segment of segments.slice(0, -1)) node = node[segment] ??= {};
    const leaf = segments.at(-1);
    if (leaf in node) throw new Error(`Дубликат пути: ${segments.join('.')}`);
    node[leaf] = convert(name, raw);
  }
  return tree;
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function main() {
  const read = (name) => fs.readFileSync(path.join(srcDir, name), 'utf8');
  const paletteCss = read('palette.css');
  const colorsCss = read('colors.css');
  const themes = buildThemes(paletteCss, colorsCss);
  const colorBlocks = parseThemeBlocks(colorsCss);
  const foundation = parseThemeBlocks(read('tokens.css')).light;

  const palette = Object.entries(parseDeclarations(paletteCss));
  const counts = {};

  writeJson(path.join(outDir, 'primitives/palette.json'), toTree(palette, (n, v) => ({ $type: 'color', $value: v.toLowerCase() })));
  counts.palette = palette.length;

  writeJson(path.join(outDir, 'foundation.json'), toTree(Object.entries(foundation), convertFoundation));
  counts.foundation = Object.keys(foundation).length;

  for (const theme of ['light', 'dark']) {
    const entries = Object.entries(colorBlocks[theme]);
    writeJson(
      path.join(outDir, `semantic/${theme}.json`),
      toTree(entries, (n, v) => convertColorLike(n, v, themes[theme]))
    );
    counts[theme] = entries.length;
  }
  console.log('[migrate] записано токенов:', counts);
}

main();
