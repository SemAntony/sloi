import { defineConfig, devices } from '@playwright/test';

// Визуальные регрессии (D32). Снимки делаются со статической сборки Storybook (`pnpm storybook:build`),
// поэтому тест не зависит от dev-сервера. Базовые снимки лежат в visual/*-snapshots/ и зависят от ОС
// (в имени файла суффикс -darwin / -linux): шрифты и сглаживание на macOS и Linux различаются.
const PORT = 6007;

export default defineConfig({
  testDir: 'visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0
    }
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], deviceScaleFactor: 1 } }],
  webServer: {
    command: `node scripts/serve-static.mjs storybook-static ${PORT}`,
    url: `http://127.0.0.1:${PORT}/iframe.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
