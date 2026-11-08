import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from './toggle';
import styles from './toggle.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Toggle',
  component: Toggle
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className={styles.stack}>
      <Toggle aria-label="Toggle bold" defaultPressed>
        B
      </Toggle>
      <p className={styles.meta}>Uncontrolled toggle with initial pressed state.</p>
    </div>
  )
};

const ControlledPreview = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <div className={styles.stack}>
      <Toggle pressed={pressed} onPressedChange={setPressed} aria-label="Toggle updates">
        Live updates
      </Toggle>
      <p className={styles.meta}>Pressed: {String(pressed)}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

export const Disabled: Story = {
  render: () => (
    <div className={styles.row}>
      <Toggle defaultPressed disabled aria-label="Pinned">
        Pinned
      </Toggle>
      <Toggle disabled aria-label="Muted">
        Muted
      </Toggle>
    </div>
  )
};

export const IconOnly: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic text">
      <span aria-hidden className={styles.icon}>
        I
      </span>
    </Toggle>
  )
};
