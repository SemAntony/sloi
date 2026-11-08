import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCHEMA_URL = 'https://www.designtokens.org/TR/2025.10/format/';
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(rootDir, 'src');
const SEMANTIC_SOURCE_FILES = ['colors.css', 'tokens.css'];

const declarationPattern = /(--sloi-[a-z0-9-]+)\s*:\s*([^;]+);/gi;

function parseDeclarations(cssContent) {
  const entries = [];
  for (const match of cssContent.matchAll(declarationPattern)) {
    const token = match[1]?.trim();
    const value = match[2]?.trim();
    if (token && value) {
      entries.push([token, value]);
    }
  }
  return entries;
}

function parseBlock(cssContent, blockPattern) {
  const blockMatch = cssContent.match(blockPattern);
  if (!blockMatch?.[1]) {
    return {};
  }
  return Object.fromEntries(parseDeclarations(blockMatch[1]));
}

function sortObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, sortObject(nested)])
  );
}

const paletteCss = fs.readFileSync(path.join(srcDir, 'palette.css'), 'utf8');
const primitivePalette = Object.fromEntries(parseDeclarations(paletteCss));
const semanticLight = {};
const semanticDark = {};

for (const fileName of SEMANTIC_SOURCE_FILES) {
  const sourceCss = fs.readFileSync(path.join(srcDir, fileName), 'utf8');
  Object.assign(semanticLight, parseBlock(sourceCss, /:root\s*{([\s\S]*?)\n}/));
  Object.assign(semanticDark, parseBlock(sourceCss, /\[data-theme='dark'\]\s*{([\s\S]*?)\n}/));
}

const artifact = sortObject({
  $schema: SCHEMA_URL,
  meta: {
    package: '@sloi/tokens',
    primitiveCount: Object.keys(primitivePalette).length,
    semanticLightCount: Object.keys(semanticLight).length,
    semanticDarkOverrideCount: Object.keys(semanticDark).length
  },
  primitive: primitivePalette,
  semantic: {
    light: semanticLight,
    dark: semanticDark
  }
});

const jsonOutput = `${JSON.stringify(artifact, null, 2)}\n`;
fs.writeFileSync(path.join(srcDir, 'tokens.json'), jsonOutput);

const jsOutput = `export const TOKEN_SCHEMA_URL = '${SCHEMA_URL}';\n` +
  `export const TOKENS = ${JSON.stringify(artifact, null, 2)};\n` +
  `export const PRIMITIVE_TOKENS = TOKENS.primitive;\n` +
  `export const SEMANTIC_TOKENS = TOKENS.semantic;\n` +
  'export default TOKENS;\n';
fs.writeFileSync(path.join(srcDir, 'tokens.js'), jsOutput);

console.log(
  `[tokens] synced artifacts: primitive=${Object.keys(primitivePalette).length}, ` +
  `semantic.light=${Object.keys(semanticLight).length}, semantic.dark=${Object.keys(semanticDark).length}`
);
