import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { FilterBar } from './filter-bar';
import storyStyles from '../input/input.stories.module.scss';

const statusOptions = (
  <select aria-label='Filter status'>
    <option value='all'>All statuses</option>
    <option value='pending'>Pending</option>
    <option value='paid'>Paid</option>
    <option value='overdue'>Overdue</option>
  </select>
);

const meta = {
  title: 'UI/FilterBar',
  component: FilterBar,
  args: {
    placeholder: 'Search invoices'
  }
} satisfies Meta<typeof FilterBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: statusOptions,
    actions: <Button size='sm'>Export</Button>
  }
};

export const States: Story = {
  render: () => (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <FilterBar
        defaultQuery='acme'
        filters={statusOptions}
        actions={<Button size='sm'>Export</Button>}
      />
      <FilterBar
        disabled
        defaultQuery='disabled state'
        filters={statusOptions}
        actions={<Button size='sm'>Action</Button>}
      />
      <FilterBar showSearchButton={false} showResetButton={false} />
    </div>
  )
};

const ControlledPreview = () => {
  const [query, setQuery] = useState('overdue');
  const [lastSearch, setLastSearch] = useState('overdue');

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        onSearch={setLastSearch}
        onReset={() => setLastSearch('')}
        filters={statusOptions}
      />
      <p className={storyStyles.meta}>
        Query: {query || '(empty)'} | Last search: {lastSearch || '(none)'}
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
