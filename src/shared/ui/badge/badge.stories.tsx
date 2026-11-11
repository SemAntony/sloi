import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Badge, type BadgeTone } from './badge';
import storyStyles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  args: {
    children: 'Label'
  }
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className={storyStyles.stack}>
      <div className={storyStyles.row}>
        <Badge tone='neutral'>Neutral</Badge>
        <Badge tone='info'>Info</Badge>
        <Badge tone='success'>Success</Badge>
        <Badge tone='warning'>Warning</Badge>
        <Badge tone='danger'>Danger</Badge>
      </div>
      <div className={storyStyles.row}>
        <Badge tone='info' appearance='solid'>Solid</Badge>
        <Badge tone='success' appearance='solid'>Solid</Badge>
        <Badge tone='warning' appearance='solid'>Solid</Badge>
      </div>
    </div>
  )
};

const ControlledPreview = () => {
  const [tone, setTone] = useState<BadgeTone>('info');

  return (
    <div className={storyStyles.stack}>
      <select aria-label='Badge tone' value={tone} onChange={(event) => setTone(event.target.value as BadgeTone)}>
        <option value='neutral'>neutral</option>
        <option value='info'>info</option>
        <option value='success'>success</option>
        <option value='warning'>warning</option>
        <option value='danger'>danger</option>
      </select>
      <Badge tone={tone}>Current tone: {tone}</Badge>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
