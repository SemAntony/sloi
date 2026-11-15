import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from 'storybook/test';
import { useState } from 'react';
import { Input } from '../input';
import { NumberField } from '../number-field';
import { PhoneField } from '../phone-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from '../primitives/select';
import { SearchInput } from '../search-input';
import { Textarea } from '../textarea';
import { Field } from './field';
import styles from './field.stories.module.scss';

const meta = {
  title: 'UI/Field',
  component: Field,
  tags: ['experimental'],
  args: {
    label: 'Email',
    hint: 'We never share your email.',
    children: <Input placeholder='you@example.com' />
  }
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true }
};

export const WithError: Story = {
  args: { error: 'Enter a valid email address.' }
};

export const Disabled: Story = {
  args: { disabled: true }
};

// P2 (D40): Label, Input и Select в одной форме выстраиваются в одну колонку и одной ширины.
export const MixedForm: Story = {
  render: () => (
    <div className={styles.form}>
      <Field label='Name' required>
        <Input placeholder='Jane Doe' />
      </Field>
      <Field label='Role' hint='Pick the closest match.'>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Choose a role' />
          </SelectTrigger>
          <SelectContent>
            <SelectViewport>
              <SelectItem value='admin'>Admin</SelectItem>
              <SelectItem value='editor'>Editor</SelectItem>
            </SelectViewport>
          </SelectContent>
        </Select>
      </Field>
      <Field label='Phone' error='Phone number is too short.'>
        <PhoneField />
      </Field>
      <Field label='Seats'>
        <NumberField />
      </Field>
      <Field label='Search'>
        <SearchInput />
      </Field>
      <Field label='Notes' hint='Optional.'>
        <Textarea />
      </Field>
    </div>
  )
};

const ValidationPreview = () => {
  const [value, setValue] = useState('');
  const error = value && !value.includes('@') ? 'Email must contain @.' : undefined;

  return (
    <Field label='Email' hint='Type without @ to see the error.' error={error}>
      <Input value={value} onChange={(event) => setValue(event.target.value)} />
    </Field>
  );
};

export const Validation: Story = {
  render: () => <ValidationPreview />,
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });

    await step('Invalid value shows the error and marks the field', async () => {
      await userEvent.type(input, 'nope');
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(input).toHaveAccessibleDescription('Type without @ to see the error. Email must contain @.');
    });

    await step('Valid value clears the error', async () => {
      await userEvent.type(input, '@x.io');
      await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    });
  }
};

export const InNarrowContainer: Story = {
  render: () => (
    <div className={styles.narrow}>
      <Field label='Role'>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Choose' />
          </SelectTrigger>
        </Select>
      </Field>
    </div>
  )
};
