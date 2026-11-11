import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Progress, ProgressIndicator } from './progress';
import styles from './progress.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Progress',
  component: Progress
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

const getIndicatorStyle = (value: number | null, max = 100) => {
  if (value == null) return undefined;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return { transform: `translateX(-${100 - percentage}%)` };
};

const ProgressRow = ({
  value,
  max = 100,
  label,
  getValueLabel
}: {
  value: number | null;
  max?: number;
  label: string;
  getValueLabel?: (value: number, max: number) => string;
}) => (
  <div className={styles.row}>
    <div className={styles.rowMeta}>
      <span>{label}</span>
      <span>{value == null ? 'indeterminate' : `${Math.round((value / max) * 100)}%`}</span>
    </div>
    <Progress aria-label={label} value={value} max={max} getValueLabel={getValueLabel}>
      <ProgressIndicator style={getIndicatorStyle(value, max)} />
    </Progress>
  </div>
);

const DefaultPreview = () => {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = window.setTimeout(() => setProgress(66), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.demo}>
      <ProgressRow value={progress} label="Upload status" />
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultPreview />
};

const ControlledPreview = () => {
  const [value, setValue] = useState(40);

  return (
    <div className={styles.demo}>
      <ProgressRow value={value} label="Controlled progress" />
      <label className={styles.sliderRow}>
        <span>Value</span>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => setValue(Number(event.currentTarget.value))}
        />
      </label>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

export const Indeterminate: Story = {
  render: () => (
    <div className={styles.demo}>
      <ProgressRow value={null} label="Background sync" />
    </div>
  )
};

export const CustomMaxAndLabel: Story = {
  render: () => (
    <div className={styles.demo}>
      <ProgressRow
        value={187}
        max={250}
        label="Downloaded 187 MB"
        getValueLabel={(value, max) => `${value} of ${max} MB`}
      />
    </div>
  )
};
