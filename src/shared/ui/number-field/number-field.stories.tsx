import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NumberField } from './number-field';
import styles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/NumberField',
  component: NumberField,
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 10
  }
} satisfies Meta<typeof NumberField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className={styles.stack}>
      <NumberField defaultValue={12} />
      <NumberField invalid defaultValue={-3} min={0} />
      <NumberField disabled defaultValue={20} />
    </div>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState<number | undefined>(5);

  return (
    <div className={styles.stack}>
      <NumberField value={value} onValueChange={setValue} min={0} max={10} />
      <p className={styles.meta}>Current value: {value ?? '(empty)'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
