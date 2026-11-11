/* eslint-disable @typescript-eslint/no-explicit-any */
// Аудит a11y для ВСЕХ stories без браузера: рендерим каждую story в jsdom и прогоняем axe.
// color-contrast отключён (jsdom не считает стили/градиенты) — его смотрим в панели Storybook.
// Запуск: pnpm test:stories-a11y  (STORIES_A11Y_STRICT=1 — падать при нарушениях).
import { composeStories, setProjectAnnotations } from '@storybook/react';
import { render } from '@testing-library/react';
import { writeFileSync } from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import * as previewAnnotations from '../../.storybook/preview';

setProjectAnnotations([previewAnnotations as any]);

const modules = import.meta.glob('../shared/**/*.stories.tsx', { eager: true }) as Record<string, any>;

type Finding = { story: string; rule: string; impact: string; target: string; help: string };
const findings: Finding[] = [];
const errors: { story: string; message: string }[] = [];

describe('stories a11y audit', () => {
  for (const [path, mod] of Object.entries(modules)) {
    const file = path.replace('../shared/', '').replace('.stories.tsx', '');
    let stories: Record<string, any>;
    try {
      stories = composeStories(mod);
    } catch (error) {
      errors.push({ story: file, message: `compose: ${(error as Error).message}` });
      continue;
    }
    for (const [name, Story] of Object.entries(stories)) {
      it(`${file} / ${name}`, async () => {
        const id = `${file} / ${name}`;
        try {
          const { container } = render(<Story />);
          const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
          for (const v of results.violations) {
            for (const n of v.nodes) {
              findings.push({ story: id, rule: v.id, impact: String(v.impact), target: n.target.join(' '), help: v.help });
            }
          }
        } catch (error) {
          errors.push({ story: id, message: (error as Error).message.split('\n')[0] });
        }
      }, 30000);
    }
  }

  afterAll(() => {
    writeFileSync('/tmp/stories-a11y.json', JSON.stringify({ findings, errors }, null, 2));
    if (process.env.STORIES_A11Y_STRICT) expect(findings).toEqual([]);
  });
});
