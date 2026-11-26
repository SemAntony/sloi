import { expect, test } from '@playwright/test';

// Пример визуальных регрессий на одном компоненте (D32): Button, обе темы.
// Тема переключается глобалом Storybook (`globals=theme:dark`), как в тулбаре; см. .storybook/preview.tsx.
const THEMES = ['light', 'dark'] as const;

const STORIES = [
  { id: 'ui-button--default', name: 'button-default' },
  { id: 'ui-button--states', name: 'button-states' }
] as const;

for (const story of STORIES) {
  for (const theme of THEMES) {
    test(`${story.name} (${theme})`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);

      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const root = page.locator('#storybook-root');
      await expect(root.locator('button').first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);

      await expect(root).toHaveScreenshot(`${story.name}-${theme}.png`);
    });
  }
}
