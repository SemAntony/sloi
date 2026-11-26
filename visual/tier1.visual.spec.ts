import { expect, test, type Page } from '@playwright/test';

// Визуальные регрессии Tier-1 (D33): docs/governance/tier-1-components.md, 12 компонентов × 2 темы.
// `rest` снимает #storybook-root в покое; `open` (если есть) открывает оверлей и снимает весь экран:
// порталы Radix лежат вне #storybook-root. Тема переключается глобалом Storybook, см. .storybook/preview.tsx.
const THEMES = ['light', 'dark'] as const;

type Entry = {
  name: string;
  id: string;
  /** Открывает оверлей; после этого снимается видимая область страницы. */
  open?: (page: Page) => Promise<void>;
};

const ENTRIES: Entry[] = [
  { name: 'button', id: 'ui-button--states' },
  { name: 'input', id: 'ui-input--states' },
  {
    name: 'select',
    id: 'ui-primitives-select--default',
    open: async (page) => {
      await page.getByRole('combobox', { name: 'Food' }).click();
      await expect(page.getByRole('option').first()).toBeVisible();
    }
  },
  {
    name: 'dialog',
    id: 'ui-primitives-dialog--non-modal',
    open: async (page) => {
      await page.locator('#storybook-root').getByRole('button').first().click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  },
  {
    name: 'dropdown-menu',
    id: 'ui-primitives-dropdownmenu--default',
    open: async (page) => {
      await page.getByRole('button', { name: 'Customize options' }).click();
      await expect(page.getByRole('menuitem').first()).toBeVisible();
    }
  },
  { name: 'tabs', id: 'ui-primitives-tabs--default' },
  { name: 'checkbox', id: 'ui-primitives-checkbox--default' },
  { name: 'radio-group', id: 'ui-primitives-radiogroup--default' },
  { name: 'switch', id: 'ui-primitives-switch--default' },
  {
    name: 'tooltip',
    id: 'ui-tooltip--states',
    open: async (page) => {
      await page.getByRole('button', { name: 'Instant' }).hover();
      await expect(page.getByRole('tooltip').first()).toBeVisible();
    }
  },
  {
    name: 'toast',
    id: 'ui-primitives-toast--background-type',
    open: async (page) => {
      await page.locator('#storybook-root').getByRole('button').first().click();
      await expect(page.getByRole('status').first()).toBeVisible();
    }
  },
  { name: 'data-table-v2', id: 'ui-datatablev2--default' }
];

const openStory = async (page: Page, id: string, theme: (typeof THEMES)[number]) => {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await expect(page.locator('#storybook-root > *').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
};

for (const entry of ENTRIES) {
  for (const theme of THEMES) {
    test(`${entry.name} rest (${theme})`, async ({ page }) => {
      await openStory(page, entry.id, theme);
      await expect(page.locator('#storybook-root')).toHaveScreenshot(`${entry.name}-rest-${theme}.png`);
    });

    if (entry.open) {
      const open = entry.open;
      test(`${entry.name} open (${theme})`, async ({ page }) => {
        await page.setViewportSize({ width: 720, height: 640 });
        await openStory(page, entry.id, theme);
        await open(page);
        await expect(page).toHaveScreenshot(`${entry.name}-open-${theme}.png`);
      });
    }
  }
}
