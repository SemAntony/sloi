import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox, type ComboboxOption } from './combobox';
import styles from '../input/input.stories.module.scss';

const countryOptions: ComboboxOption[] = [
  { value: 'am', label: 'Armenia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' }
];

const meta = {
  title: 'UI/Combobox',
  component: Combobox,
  args: {
    options: countryOptions
  }
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Select country'
  }
};

export const States: Story = {
  render: () => (
    <div className={styles.stack} style={{ width: '100%' }}>
      <Combobox options={countryOptions} placeholder='Search country' />
      <Combobox
        options={[
          ...countryOptions,
          { value: 'archived', label: 'Archived', disabled: true }
        ]}
        defaultValue='jp'
      />
      <Combobox options={countryOptions} disabled defaultValue='us' />
      <Combobox options={countryOptions} invalid defaultValue='gb' />
    </div>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState<string | undefined>('am');
  const [searchValue, setSearchValue] = useState('Armenia');

  return (
    <div className={styles.stack} style={{ width: '100%' }}>
      <Combobox
        options={countryOptions}
        value={value}
        onValueChange={setValue}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
      />
      <p className={styles.meta}>Selected value: {value ?? 'none'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
