import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent } from '@storybook/test';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['stable'],
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false,
    onClick: fn()
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost']
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))', width: '100%' }}>
      <Button {...args} variant='primary'>Primary</Button>
      <Button {...args} variant='secondary'>Secondary</Button>
      <Button {...args} variant='ghost'>Ghost</Button>
      <Button {...args} variant='primary' disabled>Primary disabled</Button>
      <Button {...args} variant='secondary' disabled>Secondary disabled</Button>
      <Button {...args} variant='ghost' disabled>Ghost disabled</Button>
    </div>
  )
};

export const Interaction: Story = {
  play: async ({ args, canvas, step }) => {
    await step('Click button', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Button' }));
    });

    await step('Verify onClick call', async () => {
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });
  }
};
