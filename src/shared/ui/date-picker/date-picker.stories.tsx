import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  DatePicker,
  type DatePickerMultipleValue,
  type DatePickerRangeValue,
  type DatePickerSingleValue
} from './date-picker';
import styles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  args: {
    mode: 'single'
  }
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mode: 'single'
  }
};

export const States: Story = {
  render: () => (
    <div className={styles.stack}>
      <DatePicker mode='single' />
      <DatePicker mode='multiple' />
      <DatePicker mode='range' />
      <DatePicker mode='single' disabled />
    </div>
  )
};

const ControlledPreview = () => {
  const [single, setSingle] = useState<DatePickerSingleValue>(new Date());
  const [multiple, setMultiple] = useState<DatePickerMultipleValue>([new Date()]);
  const [range, setRange] = useState<DatePickerRangeValue>({ from: new Date(), to: undefined });

  return (
    <div className={styles.stack}>
      <DatePicker mode='single' value={single} onValueChange={setSingle} name='singleDate' />
      <DatePicker mode='multiple' value={multiple} onValueChange={setMultiple} name='multipleDates' />
      <DatePicker mode='range' value={range} onValueChange={setRange} name='rangeDate' />
      <p className={styles.meta}>Controlled modes: single, multiple, range.</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
