import type { Meta, StoryObj } from '@storybook/react';
import styles from './design-system.stories.module.scss';

const meta = {
  title: 'Foundations/Design System'
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const colorTokens = [
  { token: '--sloi-surface-canvas', label: 'Canvas' },
  { token: '--sloi-surface-base', label: 'Base Surface' },
  { token: '--sloi-surface-elevated', label: 'Elevated Surface' },
  { token: '--sloi-interactive-primary-bg', label: 'Primary Action' },
  { token: '--sloi-status-success-bg', label: 'Success' },
  { token: '--sloi-status-warning-bg', label: 'Warning' },
  { token: '--sloi-status-danger-bg', label: 'Danger' },
  { token: '--sloi-focus-ring', label: 'Focus Ring' }
] as const;

const spacingTokens = [
  '--sloi-space-1',
  '--sloi-space-2',
  '--sloi-space-3',
  '--sloi-space-4',
  '--sloi-space-5',
  '--sloi-space-6',
  '--sloi-space-8',
  '--sloi-space-10'
] as const;

const typeTokens = [
  '--sloi-font-size-100',
  '--sloi-font-size-200',
  '--sloi-font-size-300',
  '--sloi-font-size-400',
  '--sloi-font-size-500',
  '--sloi-font-size-600'
] as const;

export const Overview: Story = {
  parameters: {
    layout: 'fullscreen'
  },
  render: () => (
    <div className={styles.layout}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Sloi Design System</h1>
        <p className={styles.heroText}>
          Практический каркас: сначала токены как source of truth, затем компоненты, затем
          паттерны экранов и обязательная документация в Storybook.
        </p>
        <div className={styles.pipeline}>
          <span className={styles.chip}>Tokens</span>
          <span className={styles.chip}>Components</span>
          <span className={styles.chip}>Patterns</span>
          <span className={styles.chip}>Documentation</span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Color Tokens</h2>
        <p className={styles.sectionHint}>
          Семантика берется из <code>tokens.css</code>, а не из прямых hex в компонентах.
        </p>
        <div className={styles.tokensGrid}>
          {colorTokens.map((item) => (
            <article key={item.token} className={styles.tokenCard}>
              <div
                className={styles.tokenSwatch}
                style={{ backgroundColor: `var(${item.token})` }}
              />
              <div className={styles.tokenMeta}>
                <p className={styles.tokenLabel}>{item.label}</p>
                <p className={styles.tokenCode}>{item.token}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Spacing Scale</h2>
        <p className={styles.sectionHint}>
          Единая spacing-шкала нужна для консистентных отступов между компонентами и внутри них.
        </p>
        <div className={styles.scaleGrid}>
          {spacingTokens.map((token) => (
            <div key={token} className={styles.scaleRow}>
              <code className={styles.scaleName}>{token}</code>
              <div className={styles.spaceTrack} style={{ width: `calc(var(${token}) * 8)` }} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography Scale</h2>
        <p className={styles.sectionHint}>
          Типографика задается токенами размеров и line-height, чтобы тексты выглядели одинаково во
          всех компонентах.
        </p>
        <div className={styles.scaleGrid}>
          {typeTokens.map((token) => (
            <div key={token} className={styles.scaleRow}>
              <code className={styles.scaleName}>{token}</code>
              <p
                className={styles.typeLine}
                style={{
                  fontSize: `var(${token})`,
                  lineHeight: 'var(--sloi-font-line-normal)'
                }}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
};
