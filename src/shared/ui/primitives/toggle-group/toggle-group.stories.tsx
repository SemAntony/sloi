import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import styles from './toggle-group.stories.module.scss';

const meta: Meta = {
  title: 'UI/Primitives/ToggleGroup'
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className={styles.stack}>
      <ToggleGroup type="single" defaultValue="center" aria-label="Text alignment">
        <ToggleGroupItem value="left" aria-label="Left aligned">
          <span aria-hidden className={styles.icon}>L</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center aligned">
          <span aria-hidden className={styles.icon}>C</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Right aligned">
          <span aria-hidden className={styles.icon}>R</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <p className={styles.meta}>Single-select alignment.</p>
    </div>
  )
};

const ControlledSinglePreview = () => {
  const [value, setValue] = useState('left');

  return (
    <div className={styles.stack}>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) {
            setValue(nextValue);
          }
        }}
        aria-label="Text alignment"
      >
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
      <p className={styles.meta}>Current value: {value}</p>
    </div>
  );
};

export const ControlledSingle: Story = {
  render: () => <ControlledSinglePreview />
};

const MultipleVerticalPreview = () => {
  const [value, setValue] = useState<string[]>(['bold']);

  return (
    <div className={styles.stack}>
      <ToggleGroup
        type="multiple"
        orientation="vertical"
        value={value}
        onValueChange={setValue}
        className={styles.groupVertical}
        aria-label="Text style"
      >
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
      <p className={styles.meta}>Selected: {value.join(', ') || 'None'}</p>
    </div>
  );
};

export const MultipleVertical: Story = {
  render: () => <MultipleVerticalPreview />
};

export const DisabledStates: Story = {
  render: () => (
    <div className={styles.row}>
      <ToggleGroup type="single" defaultValue="center" disabled aria-label="Disabled alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" defaultValue={['left']} aria-label="Partially disabled">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center" disabled>
          Center
        </ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
};
