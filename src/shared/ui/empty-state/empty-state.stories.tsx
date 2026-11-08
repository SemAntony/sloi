import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { EmptyState } from './empty-state';
import storyStyles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  args: {
    title: 'No data yet',
    description: 'Create your first item to get started.'
  }
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: <Button size='sm'>Create item</Button>
  }
};

export const States: Story = {
  render: () => (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <EmptyState
        title='No invoices found'
        description='Try changing filters or creating a new invoice.'
        icon='?'
      />
      <EmptyState
        title='No notifications'
        description='You are all caught up.'
        compact
      />
    </div>
  )
};

const ControlledPreview = () => {
  const [hasItems, setHasItems] = useState(false);

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <Button variant='secondary' size='sm' onClick={() => setHasItems((prev) => !prev)}>
        Toggle items
      </Button>
      {hasItems ? (
        <p className={storyStyles.meta}>List has content now.</p>
      ) : (
        <EmptyState
          title='List is empty'
          description='Toggle the button to simulate loaded content.'
          actions={<Button size='sm'>Add first record</Button>}
        />
      )}
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
