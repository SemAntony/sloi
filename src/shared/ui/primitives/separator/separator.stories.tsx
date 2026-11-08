import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';
import styles from './separator.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Separator',
  component: Separator
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className={styles.stack}>
      <span className={styles.heading}>Radix Primitives</span>
      <span className={styles.text}>An open-source UI component library.</span>
      <Separator />
      <div className={styles.inlineLinks}>
        <span className={styles.text}>Blog</span>
        <Separator decorative orientation="vertical" />
        <span className={styles.text}>Docs</span>
        <Separator decorative orientation="vertical" />
        <span className={styles.text}>Source</span>
      </div>
    </div>
  )
};

export const VerticalInPanel: Story = {
  render: () => (
    <div className={styles.panelRow}>
      <div className={styles.panel}>
        <span className={styles.heading}>Left panel</span>
        <span className={styles.text}>Navigation and filters</span>
      </div>
      <Separator orientation="vertical" />
      <div className={styles.panel}>
        <span className={styles.heading}>Right panel</span>
        <span className={styles.text}>Main content area</span>
      </div>
    </div>
  )
};

export const Decorative: Story = {
  render: () => (
    <div className={styles.stack}>
      <span className={styles.heading}>Decorative separator example</span>
      <Separator decorative />
      <span className={styles.text}>
        This separator is removed from the accessibility tree via <code>role="none"</code>.
      </span>
    </div>
  )
};
