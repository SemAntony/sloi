import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import styles from './label.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Label',
  component: Label
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className={styles.inlineRow}>
      <Label htmlFor="first-name">First name</Label>
      <input className={styles.input} id="first-name" defaultValue="Pedro Duarte" />
    </div>
  )
};

export const NestedControl: Story = {
  render: () => (
    <div className={styles.stack}>
      <Label className={styles.checkboxRow}>
        <input type="checkbox" defaultChecked />
        Receive product updates
      </Label>
      <p className={styles.helper}>Label wraps a native control, so click area is larger and accessible.</p>
    </div>
  )
};

export const AsChild: Story = {
  render: () => (
    <div className={styles.stack}>
      <div className={styles.inlineRow}>
        <Label asChild htmlFor="email-address">
          <label className={styles.labelAsChild}>Email address</label>
        </Label>
        <input className={styles.input} id="email-address" type="email" placeholder="you@sloi.dev" />
      </div>
      <p className={styles.helper}>
        Double-clicking the label text should not select it (Radix Label built-in behavior).
      </p>
    </div>
  )
};
