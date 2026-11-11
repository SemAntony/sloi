import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Badge } from '../badge';
import { Button } from '../button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type CardVariant } from './card';
import storyStyles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/Card',
  component: Card
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Project status</CardTitle>
        <CardDescription>Weekly update for the delivery stream.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Milestone progress is on track. QA phase starts on Wednesday.</p>
      </CardContent>
      <CardFooter>
        <Button size='sm'>Open report</Button>
      </CardFooter>
    </Card>
  )
};

export const States: Story = {
  render: () => (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <Card variant='outlined'>
        <CardHeader>
          <CardTitle>Outlined card</CardTitle>
          <CardDescription>Low elevation for dense layouts.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant='elevated' padding='lg'>
        <CardHeader>
          <CardTitle>Elevated card</CardTitle>
          <CardDescription>Good for highlighted content blocks.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge tone='success'>Stable</Badge>
          <Badge tone='warning'>Needs review</Badge>
        </CardFooter>
      </Card>
    </div>
  )
};

const ControlledPreview = () => {
  const [variant, setVariant] = useState<CardVariant>('elevated');

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <select aria-label='Card variant' value={variant} onChange={(event) => setVariant(event.target.value as CardVariant)}>
        <option value='elevated'>elevated</option>
        <option value='outlined'>outlined</option>
      </select>
      <Card variant={variant}>
        <CardHeader>
          <CardTitle>Controlled variant</CardTitle>
          <CardDescription>Current variant: {variant}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
