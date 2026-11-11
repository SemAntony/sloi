import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from 'storybook/test';
import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react';
import { Label } from '../label';
import { Checkbox, CheckboxIndicator } from './checkbox';
import styles from './checkbox.stories.module.scss';

type CheckedState = boolean | 'indeterminate';

const meta = {
  title: 'UI/Primitives/Checkbox',
  component: Checkbox
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const id = 'checkbox-story-id';

    return (
      <div className={styles.row}>
        <Checkbox id={id} defaultChecked />
        <Label htmlFor={id}>Accept terms and conditions.</Label>
      </div>
    );
  }
};

const ControlledPreview = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        <Checkbox id="checkbox-controlled" checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
        <Label htmlFor="checkbox-controlled">Receive product updates</Label>
      </div>
      <p className={styles.status}>Current state: {checked ? 'checked' : 'unchecked'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />,
  play: async ({ canvas, step }) => {
    await step('Toggle controlled checkbox', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Receive product updates' }));
      await expect(canvas.getByText('Current state: checked')).toBeInTheDocument();
    });
  }
};

const IndeterminatePreview = () => {
  const [checked, setChecked] = useState<CheckedState>('indeterminate');

  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        <Checkbox id="checkbox-indeterminate" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="checkbox-indeterminate">All permissions</Label>
      </div>
      <div className={styles.controls}>
        <button type="button" className={styles.button} onClick={() => setChecked(true)}>Check all</button>
        <button type="button" className={styles.button} onClick={() => setChecked(false)}>Uncheck all</button>
        <button type="button" className={styles.button} onClick={() => setChecked('indeterminate')}>
          Set mixed
        </button>
      </div>
      <p className={styles.status}>Current state: {checked}</p>
    </div>
  );
};

export const Indeterminate: Story = {
  render: () => <IndeterminatePreview />
};

const FormPreview = () => {
  const [result, setResult] = useState('Submit to inspect FormData value');

  return (
    <form
      className={styles.stack}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(data.get('terms') ? `terms=${String(data.get('terms'))}` : 'terms is missing');
      }}
    >
      <div className={styles.row}>
        <Checkbox id="checkbox-form" name="terms" required value="accepted" />
        <Label htmlFor="checkbox-form">I agree with terms</Label>
      </div>
      <button type="submit" className={styles.button}>Submit form</button>
      <p className={styles.status}>{result}</p>
    </form>
  );
};

export const FormIntegration: Story = {
  render: () => <FormPreview />
};

const CheckboxLeaf = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} type="button" className={className} {...props} />
  )
);

CheckboxLeaf.displayName = 'CheckboxLeaf';

export const AsChild: Story = {
  render: () => (
    <div className={styles.row}>
      <Checkbox asChild defaultChecked>
        <CheckboxLeaf className={styles.asChildButton} aria-label="Toggle task completion">
          <CheckboxIndicator />
        </CheckboxLeaf>
      </Checkbox>
      <span className={styles.status}>Composed via asChild</span>
    </div>
  )
};
