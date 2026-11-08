import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PhoneField } from './phone-field';
import styles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/PhoneField',
  component: PhoneField
} satisfies Meta<typeof PhoneField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '+1 (555) 123-4567'
  }
};

export const States: Story = {
  render: () => (
    <div className={styles.stack}>
      <PhoneField defaultValue='+1 (555) 100-1010' />
      <PhoneField invalid defaultValue='123' />
      <PhoneField disabled defaultValue='+1 (555) 000-0000' />
    </div>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState('+374 ');

  return (
    <div className={styles.stack}>
      <PhoneField value={value} onValueChange={setValue} />
      <p className={styles.meta}>Value: {value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
