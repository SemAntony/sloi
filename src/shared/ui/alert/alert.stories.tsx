import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Alert, type AlertTone } from './alert';
import storyStyles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  args: {
    tone: 'info',
    title: 'Heads up',
    description: 'There is an update available for this workspace.'
  }
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'i'
  }
};

export const States: Story = {
  render: () => (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <Alert tone='info' title='Info' description='Background sync is running.' icon='i' />
      <Alert tone='success' title='Success' description='Profile updated successfully.' icon='ok' />
      <Alert tone='warning' title='Warning' description='Your trial expires in 2 days.' icon='!' />
      <Alert tone='error' title='Error' description='Payment failed, retry required.' icon='x' />
    </div>
  )
};

const ControlledPreview = () => {
  const [tone, setTone] = useState<AlertTone>('info');

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <select value={tone} onChange={(event) => setTone(event.target.value as AlertTone)}>
        <option value='info'>info</option>
        <option value='success'>success</option>
        <option value='warning'>warning</option>
        <option value='error'>error</option>
      </select>
      <Alert
        tone={tone}
        title='Controlled alert'
        description={`Current tone is ${tone}.`}
        icon='*'
        actions={<Button size='sm' variant='secondary'>Open details</Button>}
      />
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
