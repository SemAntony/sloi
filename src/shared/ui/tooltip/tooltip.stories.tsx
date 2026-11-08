import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor } from '@storybook/test';
import { useState } from 'react';
import { Button } from '../button';
import { Tooltip } from './tooltip';
import styles from './tooltip.stories.module.scss';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['stable'],
  args: {
    content: 'Tooltip text',
    delayDuration: 250,
    showArrow: true,
    children: <Button variant='secondary'>Hover me</Button>
  }
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Tooltip {...args} />
};

export const States: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: () => (
    <div className={styles.stack}>
      <Tooltip content='Default tooltip'>
        <Button variant='secondary'>Default</Button>
      </Tooltip>
      <Tooltip content='Shows instantly' delayDuration={0}>
        <Button variant='secondary'>Instant</Button>
      </Tooltip>
      <Tooltip content='Tooltip without arrow' showArrow={false}>
        <Button variant='secondary'>No arrow</Button>
      </Tooltip>
    </div>
  )
};

const ControlledPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.stack}>
      <Tooltip
        open={open}
        onOpenChange={setOpen}
        content='Controlled tooltip'
        children={<Button variant='secondary'>Hover or focus me</Button>}
      />
      <p className={styles.meta}>Open: {String(open)}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />,
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('button', { name: 'Hover or focus me' });

    await step('Open controlled tooltip on hover', async () => {
      await userEvent.hover(trigger);
      await expect(await canvas.findByRole('tooltip')).toHaveTextContent('Controlled tooltip');
      await expect(canvas.getByText('Open: true')).toBeInTheDocument();
    });

    await step('Close controlled tooltip on unhover', async () => {
      await userEvent.unhover(trigger);
      await waitFor(() => {
        expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
      });
      await expect(canvas.getByText('Open: false')).toBeInTheDocument();
    });
  }
};

const TooltipContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className={styles.panel}>
      <Tooltip
        container={container}
        content='Tooltip is rendered into this panel'
      >
        <Button variant='secondary'>Hover me</Button>
      </Tooltip>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: () => <TooltipContainerPreview />
};
