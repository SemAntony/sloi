import type { Meta, StoryObj } from '@storybook/react';
import { FieldMessage } from './field-message';
import styles from './field-message.stories.module.scss';

const meta = {
  title: 'UI/FieldMessage',
  component: FieldMessage,
  args: {
    children: 'Helper text'
  }
} satisfies Meta<typeof FieldMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className={styles.stack}>
      <FieldMessage tone='default'>Use at least 8 characters.</FieldMessage>
      <FieldMessage tone='error'>Password is too short.</FieldMessage>
      <FieldMessage tone='success'>Looks good.</FieldMessage>
    </div>
  )
};

export const Controlled: Story = {
  render: () => <FieldMessage tone='error'>This message can be driven by form state.</FieldMessage>
};
