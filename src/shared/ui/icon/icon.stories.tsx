import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './icon';
import {
  ICON_LIBRARY,
  ICON_LIBRARY_CATEGORIES,
  ICON_LIBRARY_COUNT,
  IconBell,
  IconFolderOpen,
  IconSearch,
  IconTrash2
} from './icons';
import styles from './icon.stories.module.scss';

const meta = {
  title: 'Foundations/Icons',
  component: Icon,
  args: {
    icon: IconSearch
  }
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

const categoryLabelMap = {
  actions: 'Actions',
  navigation: 'Navigation',
  status: 'Status',
  data: 'Data & layout',
  system: 'System & forms'
} as const;

export const Catalog: Story = {
  render: () => (
    <div className={styles.catalogLayout}>
      <p className={styles.catalogMeta}>
        Curated set: {ICON_LIBRARY_COUNT} icons.
      </p>

      {ICON_LIBRARY_CATEGORIES.map((category) => (
        <section key={category} className={styles.catalogSection}>
          <h3 className={styles.catalogTitle}>{categoryLabelMap[category]}</h3>
          <div className={styles.catalogGrid}>
            {ICON_LIBRARY[category].map((entry) => (
              <div key={entry.name} className={styles.catalogItem}>
                <Icon icon={entry.icon} />
                <code>{entry.name}</code>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className={styles.row}>
      <Icon icon={IconSearch} size='sm' />
      <Icon icon={IconSearch} size='md' />
      <Icon icon={IconSearch} size='lg' />
    </div>
  )
};

export const Tones: Story = {
  render: () => (
    <div className={styles.toneGrid}>
      <div className={styles.toneItem}>
        <Icon icon={IconBell} tone='primary' />
        <code>primary</code>
      </div>
      <div className={styles.toneItem}>
        <Icon icon={IconBell} tone='secondary' />
        <code>secondary</code>
      </div>
      <div className={styles.toneItem}>
        <Icon icon={IconBell} tone='muted' />
        <code>muted</code>
      </div>
      <div className={styles.toneItemInfo}>
        <Icon icon={IconBell} tone='info' />
        <code>info</code>
      </div>
      <div className={styles.toneItemSuccess}>
        <Icon icon={IconBell} tone='success' />
        <code>success</code>
      </div>
      <div className={styles.toneItemWarning}>
        <Icon icon={IconBell} tone='warning' />
        <code>warning</code>
      </div>
      <div className={styles.toneItemDanger}>
        <Icon icon={IconBell} tone='danger' />
        <code>danger</code>
      </div>
    </div>
  )
};

export const ColorInheritance: Story = {
  render: () => (
    <div className={styles.layout}>
      <div className={styles.inheritPrimary}>
        <Icon icon={IconSearch} tone='current' />
        <span>`tone=current` inherits parent color.</span>
      </div>
      <div className={styles.inheritAccent}>
        <Icon icon={IconSearch} tone='current' />
        <span>Use this for icon + text blocks.</span>
      </div>
    </div>
  )
};

export const UsageRules: Story = {
  render: () => (
    <div className={styles.layout}>
      <div className={styles.row}>
        <Icon icon={IconBell} />
        <span>Decorative icon (default). Not announced by screen readers.</span>
      </div>

      <button type='button' className={styles.iconButton}>
        <Icon icon={IconFolderOpen} decorative={false} label='Open folder' />
        Open
      </button>

      <div className={styles.row}>
        <Icon icon={IconTrash2} />
        <span>Use text next to icon when action meaning needs clarity.</span>
      </div>
    </div>
  )
};

export const AccessibilityContract: Story = {
  render: () => (
    <div className={styles.a11yGrid}>
      <section className={styles.a11yCard}>
        <h4 className={styles.a11yTitle}>Decorative in text button</h4>
        <button type='button' className={styles.iconButton}>
          <Icon icon={IconSearch} />
          Search incidents
        </button>
        <p className={styles.a11yNote}>Icon remains decorative because text already names action.</p>
      </section>

      <section className={styles.a11yCard}>
        <h4 className={styles.a11yTitle}>Informative icon-only control</h4>
        <button type='button' className={styles.iconOnlyButton}>
          <Icon icon={IconBell} decorative={false} label='Notifications' />
        </button>
        <p className={styles.a11yNote}>
          Icon-only controls must have accessible name via <code>label</code> or control{' '}
          <code>aria-label</code>.
        </p>
      </section>
    </div>
  )
};
