import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from 'storybook/test';
import { useState } from 'react';
import { NumberField } from '../number-field';
import { PhoneField } from '../phone-field';
import { SearchInput } from '../search-input';
import { Textarea } from '../textarea';
import { Input } from './input';
import styles from './input.stories.module.scss';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['stable'],
  args: {
    placeholder: 'Type something...'
  }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    invalid: true
  }
};

export const States: Story = {
  render: () => (
    <div className={styles.stack}>
      <Input placeholder='Default' />
      <Input placeholder='Disabled' disabled />
      <Input placeholder='Read only value' readOnly defaultValue='Read only' />
      <Input placeholder='Invalid state' invalid defaultValue='Incorrect value' />
    </div>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState('Controlled value');

  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        <Input aria-label='Controlled input' value={value} onChange={(event) => setValue(event.target.value)} />
        <p className={styles.meta}>Current value: {value || '(empty)'}</p>
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

export const Interaction: Story = {
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole('textbox');

    await step('Type input value', async () => {
      await userEvent.type(input, 'Hello Storybook');
    });

    await step('Validate typed value', async () => {
      await expect(input).toHaveValue('Hello Storybook');
    });
  }
};

// P1 (D38): поля с width: 100% не должны вылезать за контейнер без reset приложения.
export const InNarrowContainer: Story = {
  render: () => (
    <div className={styles.narrow} data-testid='narrow-container'>
      <Input aria-label='Input' placeholder='Input' />
      <Textarea aria-label='Textarea' placeholder='Textarea' />
      <PhoneField aria-label='Phone' placeholder='Phone' />
      <SearchInput aria-label='Search' placeholder='Search' />
      <NumberField aria-label='Number' />
    </div>
  ),
  play: async ({ canvas, step }) => {
    const container = canvas.getByTestId('narrow-container');

    await step('Fields stay inside the container', async () => {
      const limit = container.getBoundingClientRect().right + 0.5;
      for (const field of container.querySelectorAll('input, textarea')) {
        await expect(field.getBoundingClientRect().right).toBeLessThanOrEqual(limit);
      }
    });
  }
};
