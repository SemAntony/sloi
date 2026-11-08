import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Textarea } from './textarea';
import styles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Write your message...'
  }
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className={styles.stack}>
      <Textarea placeholder='Default' />
      <Textarea placeholder='Disabled' disabled />
      <Textarea placeholder='Read only' readOnly defaultValue='Read only text' />
      <Textarea placeholder='Invalid' invalid defaultValue='Too short' />
    </div>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState('Controlled textarea value');

  return (
    <div className={styles.stack}>
      <Textarea value={value} onChange={(event) => setValue(event.target.value)} />
      <p className={styles.meta}>Length: {value.length}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
