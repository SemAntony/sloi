import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Breadcrumb } from './breadcrumb';
import styles from '../input/input.stories.module.scss';

const items = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Design System', href: '#' },
  { label: 'Data Table' }
];

const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  args: {
    items
  }
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className={styles.stack}>
      <Breadcrumb items={items} />
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Library', href: '#' },
          { label: 'Draft', disabled: true },
          { label: 'Current page' }
        ]}
      />
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '#' },
          { label: 'Reports', href: '#' },
          { label: 'Quarterly' }
        ]}
        separator='→'
      />
    </div>
  )
};

const ControlledPreview = () => {
  const [currentIndex, setCurrentIndex] = useState(2);

  return (
    <div className={styles.stack}>
      <Breadcrumb
        items={[
          { label: 'Step 1' },
          { label: 'Step 2' },
          { label: 'Step 3' },
          { label: 'Step 4' }
        ]}
        currentIndex={currentIndex}
        onCurrentIndexChange={setCurrentIndex}
      />
      <p className={styles.meta}>Controlled current index: {currentIndex}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
