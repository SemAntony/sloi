import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Alert } from '../alert';
import { Badge } from '../badge';
import { Button } from '../button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';
import { EmptyState } from '../empty-state';
import { Skeleton } from '../skeleton';
import styles from './states-examples.stories.module.scss';

type ViewState = 'loading' | 'empty' | 'error' | 'success';

const meta = {
  title: 'UI/Patterns/States Examples'
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const StatesPreview = () => {
  const [state, setState] = useState<ViewState>('loading');

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Dashboard states</h2>
      <p className={styles.subtitle}>One flow for loading, empty, error and success cases.</p>

      <div className={styles.controls}>
        <label htmlFor='state'>Current state</label>
        <select id='state' value={state} onChange={(event) => setState(event.target.value as ViewState)}>
          <option value='loading'>loading</option>
          <option value='empty'>empty</option>
          <option value='error'>error</option>
          <option value='success'>success</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer metrics</CardTitle>
          <CardDescription>Last 30 days performance snapshot.</CardDescription>
        </CardHeader>

        <CardContent>
          {state === 'loading' ? (
            <div className={styles.skeletonGroup}>
              <Skeleton shape='text' width='35%' />
              <Skeleton shape='rect' height='8rem' />
              <Skeleton shape='text' width='60%' />
            </div>
          ) : null}

          {state === 'empty' ? (
            <EmptyState
              title='No metrics yet'
              description='Data will appear after your first campaign is launched.'
              compact
              actions={<Button size='sm'>Create campaign</Button>}
            />
          ) : null}

          {state === 'error' ? (
            <Alert
              tone='error'
              title='Failed to fetch metrics'
              description='There was a network issue. Retry in a few seconds.'
              icon='x'
              actions={<Button size='sm' variant='secondary'>Retry</Button>}
            />
          ) : null}

          {state === 'success' ? (
            <Alert
              tone='success'
              title='Metrics loaded'
              description='Everything is synced and up to date.'
              icon='ok'
            />
          ) : null}
        </CardContent>

        <CardFooter>
          <Badge tone='info'>live</Badge>
          <p className={styles.meta}>State-driven UI pattern for product screens.</p>
        </CardFooter>
      </Card>
    </section>
  );
};

export const StateFlow: Story = {
  render: () => <StatesPreview />
};
