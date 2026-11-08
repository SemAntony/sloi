import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup } from './input-group';
import styles from './input-group.stories.module.scss';

const meta = {
  title: 'UI/InputGroup',
  component: InputGroup
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup startElement='@' endElement='.com'>
      <input placeholder='username' />
    </InputGroup>
  )
};

export const States: Story = {
  render: () => (
    <div className={styles.stack}>
      <InputGroup startElement='@'>
        <input placeholder='Default' />
      </InputGroup>
      <InputGroup startElement='@' invalid>
        <input placeholder='Invalid' defaultValue='wrong value' />
      </InputGroup>
      <InputGroup startElement='@' disabled>
        <input placeholder='Disabled' />
      </InputGroup>
    </div>
  )
};

export const Controlled: Story = {
  render: () => (
    <InputGroup startElement='https://' endElement='.sloi.app'>
      <input value='docs' readOnly />
    </InputGroup>
  )
};
