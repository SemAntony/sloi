import { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import '@sloi/tokens/css/styles.css';
import '@sloi/tokens/css/base.css';

type Theme = 'light' | 'dark';

const THEMES: Theme[] = ['light', 'dark'];

const preview: Preview = {
  tags: ['autodocs', 'stable'],
  globalTypes: {
    theme: {
      description: 'Цветовая тема (data-theme на <html>)',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' }
        ]
      }
    }
  },
  initialGlobals: {
    theme: 'light'
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      test: 'error',
      config: {
        rules: [
          {
            // Button primary/danger: фон это градиент, axe не умеет считать контраст поверх него и в панели
            // пишет needs review ("background color could not be determined due to a background gradient").
            // Реальный контраст текста на всех цветах градиента, во всех темах, проверяет
            // src/test/token-contrast.test.ts (пары в packages/tokens/scripts/contrast-pairs.json).
            // Правило color-contrast остаётся включённым для всего остального.
            id: 'color-contrast',
            selector: ':not(button[class*="_variantPrimary_"]):not(button[class*="_variantDanger_"])'
          }
        ]
      }
    },
    // Фон канваса задаёт тема (data-theme + base.css). Переключатель Backgrounds выключен: он красит
    // канвас поверх темы через !important, и тёмные токены оказываются на светлом #F8F8F8 (ложные FAIL в a11y).
    backgrounds: { disable: true },
    layout: 'centered',
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Foundations', 'Primitives', 'UI', 'Patterns', '*']
      }
    }
  },
  decorators: [
    (Story, { globals, viewMode }) => {
      const theme: Theme = THEMES.includes(globals.theme as Theme) ? (globals.theme as Theme) : 'light';

      useEffect(() => {
        document.documentElement.dataset.theme = theme;
      }, [theme]);

      // В docs-режиме превью лежит на светлом фоне Storybook, поэтому даём ему фон и цвет текста темы.
      if (viewMode === 'docs') {
        return (
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              color: 'var(--sloi-text-primary)',
              background: 'var(--sloi-surface-canvas)'
            }}
          >
            <Story />
          </div>
        );
      }

      return <Story />;
    },
    (Story, { parameters }) => {
      const pageLayout = parameters.pageLayout as 'page' | 'page-mobile' | undefined;

      if (pageLayout === 'page') {
        return (
          <div style={{ width: '100%', maxWidth: 1080, margin: '0 auto', padding: 24 }}>
            <Story />
          </div>
        );
      }

      if (pageLayout === 'page-mobile') {
        return (
          <div style={{ width: 390, margin: '0 auto', padding: 16 }}>
            <Story />
          </div>
        );
      }

      return <Story />;
    }
  ]
};

export default preview;
