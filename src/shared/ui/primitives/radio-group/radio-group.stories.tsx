import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { useState } from 'react';
import { cn } from '../../../lib/cn/cn';
import { Label } from '../label';
import { RadioGroup, RadioGroupItem } from './radio-group';
import styles from './radio-group.stories.module.scss';

const OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' }
] as const;

const meta = {
  title: 'UI/Primitives/RadioGroup',
  component: RadioGroup
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const OptionRow = ({
  id,
  value,
  label,
  indicator
}: {
  id: string;
  value: string;
  label: string;
  indicator?: React.ReactNode;
}) => (
  <div className={styles.option}>
    <RadioGroupItem value={value} id={id} indicator={indicator} />
    <Label className={styles.label} htmlFor={id}>
      {label}
    </Label>
  </div>
);

export const Default: Story = {
  render: () => (
    <RadioGroup className={styles.group} defaultValue="default" aria-label="View density">
      {OPTIONS.map((option, index) => (
        <OptionRow
          key={option.value}
          id={`density-default-${index}`}
          value={option.value}
          label={option.label}
        />
      ))}
    </RadioGroup>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState('comfortable');

  return (
    <div className={styles.stack}>
      <RadioGroup className={styles.group} value={value} onValueChange={setValue} aria-label="Controlled density">
        {OPTIONS.map((option, index) => (
          <OptionRow
            key={option.value}
            id={`density-controlled-${index}`}
            value={option.value}
            label={option.label}
          />
        ))}
      </RadioGroup>

      <p className={styles.status}>Selected: {value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />,
  play: async ({ canvas, step }) => {
    await step('Switch controlled radio value', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Compact' }));
      await expect(canvas.getByText('Selected: compact')).toBeInTheDocument();
    });
  }
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup
      className={cn(styles.group, styles.groupHorizontal)}
      defaultValue="default"
      orientation="horizontal"
      aria-label="Horizontal density"
    >
      {OPTIONS.map((option, index) => (
        <OptionRow
          key={option.value}
          id={`density-horizontal-${index}`}
          value={option.value}
          label={option.label}
        />
      ))}
    </RadioGroup>
  )
};

export const CustomIndicator: Story = {
  render: () => (
    <RadioGroup className={styles.group} defaultValue="comfortable" aria-label="Custom indicator">
      {OPTIONS.map((option, index) => (
        <OptionRow
          key={option.value}
          id={`density-custom-${index}`}
          value={option.value}
          label={option.label}
          indicator={<span aria-hidden className={styles.customIndicator}>■</span>}
        />
      ))}
    </RadioGroup>
  )
};
