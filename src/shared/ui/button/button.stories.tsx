import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent } from 'storybook/test';
import { Button } from './button';
import {Icon, IconArrowLeft, IconPlus, IconBell} from "../icon"

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['stable'],
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    onClick: fn()
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost', 'danger']
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
      <Button {...args} variant='danger'>Danger</Button>
      <Button {...args} variant='danger' disabled>Danger disabled</Button>
      <Button {...args} variant='danger' loading>Danger loading</Button>
      <Button {...args} variant='ghost' iconOnly><Icon icon={IconArrowLeft}/></Button>
      <Button {...args} variant='secondary' iconOnly><Icon icon={IconBell}/></Button>
      <Button {...args} variant='primary' iconOnly><Icon icon={IconPlus}/></Button>
      <Button {...args} variant='primary' iconOnly disabled><Icon icon={IconArrowLeft}/></Button>
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

export const Loading: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))', width: '100%' }}>
      <Button {...args} variant='primary' loading>Primary</Button>
      <Button {...args} variant='secondary' loading>Secondary</Button>
      <Button {...args} variant='ghost' loading>Ghost</Button>
      <Button {...args} size='sm' loading>Small</Button>
      <Button {...args} size='lg' loading>Large</Button>
      <Button {...args} variant='secondary' iconOnly loading aria-label='Refresh'><Icon icon={IconBell}/></Button>
    </div>
  ),
  play: async ({ args, canvas, step }) => {
    const button = canvas.getByRole('button', { name: 'Primary' });

    await step('Loading button is busy but stays focusable', async () => {
      await expect(button).toHaveAttribute('aria-busy', 'true');
      await expect(button).toBeEnabled();
    });

    await step('Click is blocked while loading', async () => {
      await userEvent.click(button);
      await expect(args.onClick).not.toHaveBeenCalled();
    });
  }
};

export const WithIcons: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))', width: '100%' }}>
      <Button {...args} startIcon={<Icon icon={IconPlus} size='sm' />}>Add item</Button>
      <Button {...args} variant='secondary' endIcon={<Icon icon={IconBell} size='sm' />}>Notify me</Button>
      <Button {...args} variant='ghost' startIcon={<Icon icon={IconArrowLeft} size='sm' />}>Back</Button>
      <Button {...args} variant='danger' startIcon={<Icon icon={IconBell} size='sm' />}>Delete</Button>
      <Button {...args} startIcon={<Icon icon={IconPlus} size='sm' />} loading>Saving</Button>
      <Button asChild {...args} variant='secondary' startIcon={<Icon icon={IconArrowLeft} size='sm' />}>
        <a href='#docs'>Docs link</a>
      </Button>
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step('Icons are decorative and keep the accessible name', async () => {
      await expect(canvas.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
      await expect(canvas.getByRole('link', { name: 'Docs link' })).toBeInTheDocument();
    });
  }
};
