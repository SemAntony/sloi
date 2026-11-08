import type { Meta, StoryObj } from '@storybook/react';
import styles from './colors.stories.module.scss';

const meta = {
  title: 'Foundations/Colors'
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const semanticTokens = [
  { token: '--sloi-surface-canvas', usage: 'Page canvas and app background.' },
  { token: '--sloi-surface-base', usage: 'Default component surface.' },
  { token: '--sloi-surface-elevated', usage: 'Raised blocks and nested surfaces.' },
  { token: '--sloi-text-primary', usage: 'Primary readable text.' },
  { token: '--sloi-text-secondary', usage: 'Secondary metadata text.' },
  { token: '--sloi-text-muted', usage: 'Muted helper text.' },
  { token: '--sloi-interactive-primary-bg', usage: 'Main action background.' },
  { token: '--sloi-focus-ring', usage: 'Focus ring color for keyboard users.' },
  { token: '--sloi-status-success-bg', usage: 'Success status background.' },
  { token: '--sloi-status-warning-bg', usage: 'Warning status background.' },
  { token: '--sloi-status-danger-bg', usage: 'Danger status background.' },
  { token: '--sloi-status-info-bg', usage: 'Info status background.' }
] as const;

const primitiveFamilies = [
  { label: 'Blue', prefix: '--sloi-palette-blue-' },
  { label: 'Green', prefix: '--sloi-palette-green-' },
  { label: 'Amber', prefix: '--sloi-palette-amber-' },
  { label: 'Red', prefix: '--sloi-palette-red-' },
  { label: 'Slate', prefix: '--sloi-palette-slate-' },
  { label: 'Neutral', prefix: '--sloi-palette-neutral-' }
] as const;

const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const SemanticAndPalette: Story = {
  parameters: {
    layout: 'fullscreen'
  },
  render: () => (
    <div className={styles.layout}>
      <section className={styles.section}>
        <h2 className={styles.title}>Semantic Tokens</h2>
        <p className={styles.hint}>
          Используем семантические токены в компонентах. Primitive palette применяется только при
          расширении foundations и маппится в semantic layer.
        </p>
        <div className={styles.tokenGrid}>
          {semanticTokens.map((item) => (
            <article key={item.token} className={styles.tokenCard}>
              <div className={styles.swatch} style={{ backgroundColor: `var(${item.token})` }} />
              <code className={styles.tokenName}>{item.token}</code>
              <p className={styles.tokenUsage}>{item.usage}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Primitive Palette</h2>
        <div className={styles.paletteRows}>
          {primitiveFamilies.map((family) => (
            <div key={family.prefix} className={styles.paletteRow}>
              <p className={styles.paletteLabel}>{family.label}</p>
              <div className={styles.paletteScale}>
                {steps.map((step) => {
                  const token = `${family.prefix}${step}`;
                  return (
                    <div key={token} className={styles.step}>
                      <div className={styles.stepSwatch} style={{ backgroundColor: `var(${token})` }} />
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Theme Preview</h2>
        <div className={styles.themeGrid}>
          <article className={styles.themeCard}>
            <h3 className={styles.themeTitle}>Light</h3>
            <div className={styles.surface}>
              <div className={styles.surfaceHead}>Default Surface</div>
              <p className={styles.textPrimary}>Primary text</p>
              <p className={styles.textSecondary}>Secondary text</p>
              <div className={styles.statusRow}>
                <span className={styles.statusSuccess}>Success</span>
                <span className={styles.statusWarning}>Warning</span>
                <span className={styles.statusDanger}>Danger</span>
              </div>
            </div>
          </article>

          <article className={styles.themeCard} data-theme='dark'>
            <h3 className={styles.themeTitle}>Dark</h3>
            <div className={styles.surface}>
              <div className={styles.surfaceHead}>Default Surface</div>
              <p className={styles.textPrimary}>Primary text</p>
              <p className={styles.textSecondary}>Secondary text</p>
              <div className={styles.statusRow}>
                <span className={styles.statusSuccess}>Success</span>
                <span className={styles.statusWarning}>Warning</span>
                <span className={styles.statusDanger}>Danger</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
};
