import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Skeleton } from './skeleton';
import storyStyles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    shape: 'text'
  }
};

export const States: Story = {
  render: () => (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <Skeleton shape='text' width='60%' />
      <Skeleton shape='rect' />
      <Skeleton shape='circle' />
      <Skeleton shape='text' animated={false} width='40%' />
    </div>
  )
};

const ControlledPreview = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <Button variant='secondary' size='sm' onClick={() => setLoading((prev) => !prev)}>
        Toggle loading
      </Button>
      {loading ? (
        <>
          <Skeleton shape='text' width='70%' />
          <Skeleton shape='text' width='45%' />
          <Skeleton shape='rect' />
        </>
      ) : (
        <p className={storyStyles.meta}>Loaded content is shown here.</p>
      )}
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
