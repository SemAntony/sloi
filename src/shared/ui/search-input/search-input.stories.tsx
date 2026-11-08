import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchInput } from './search-input';
import styles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/SearchInput',
  component: SearchInput,
  args: {
    placeholder: 'Search components'
  }
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className={styles.stack}>
      <SearchInput placeholder='Default' defaultValue='button' />
      <SearchInput placeholder='Disabled' disabled defaultValue='disabled search' />
      <SearchInput placeholder='Invalid' invalid defaultValue='?' />
    </div>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState('tabs');

  return (
    <div className={styles.stack}>
      <SearchInput value={value} onValueChange={setValue} />
      <p className={styles.meta}>Query: {value || '(empty)'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
