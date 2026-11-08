import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

const REACT_WRAPPER_FILES = [
  'src/shared/ui/primitives/dialog/dialog.tsx',
  'src/shared/ui/primitives/select/select.tsx',
  'src/shared/ui/primitives/tabs/tabs.tsx',
  'src/shared/ui/tooltip/tooltip.tsx',
  'src/shared/ui/combobox/combobox.tsx'
] as const;

const FORBIDDEN_REACT_BEHAVIOR_HOOKS = [
  'useState',
  'useReducer',
  'useEffect',
  'useLayoutEffect'
] as const;

describe('Multi-framework thin wrappers contract', () => {
  it('keeps targeted React wrappers thin and headless-driven', () => {
    for (const relativePath of REACT_WRAPPER_FILES) {
      const absolutePath = resolve(root, relativePath);
      const source = readFileSync(absolutePath, 'utf8');

      expect(source, `${relativePath} must use @sloi/headless-core`).toMatch(
        /from '@sloi\/headless-core'/
      );

      for (const hookName of FORBIDDEN_REACT_BEHAVIOR_HOOKS) {
        expect(
          source,
          `${relativePath} should not own state-machine logic via ${hookName}`
        ).not.toMatch(new RegExp(`\\b${hookName}\\b`));
      }
    }
  });

  it('keeps Lit wrapper package scaffold aligned with thin-wrapper contract', () => {
    const litReadmePath = resolve(root, 'packages/lit-wrappers/README.md');
    const litPackagePath = resolve(root, 'packages/lit-wrappers/package.json');
    const litReadme = readFileSync(litReadmePath, 'utf8');
    const litPackage = readFileSync(litPackagePath, 'utf8');

    expect(litPackage).toContain('"name": "@sloi/lit-wrappers"');
    expect(litReadme).toContain('Thin wrapper layer for Lit runtime');
    expect(litReadme).toContain('No duplicated domain logic in wrappers.');
  });
});
