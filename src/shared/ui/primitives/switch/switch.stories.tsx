import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { useState } from 'react';
import { Label } from '../label';
import { Switch, SwitchThumb } from './switch';
import styles from './switch.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Switch',
  component: Switch
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const id = 'switch-default';
    return (
      <div className={styles.row}>
        <Label htmlFor={id}>Airplane mode</Label>
        <Switch id={id} defaultChecked>
          <SwitchThumb />
        </Switch>
      </div>
    );
  }
};

const ControlledPreview = () => {
  const [checked, setChecked] = useState(true);
  const id = 'switch-controlled';

  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        <Label htmlFor={id}>Notifications</Label>
        <Switch id={id} checked={checked} onCheckedChange={setChecked}>
          <SwitchThumb />
        </Switch>
      </div>
      <span className={styles.status}>State: {checked ? 'on' : 'off'}</span>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />,
  play: async ({ canvas, step }) => {
    await step('Toggle controlled switch', async () => {
      await userEvent.click(canvas.getByRole('switch', { name: 'Notifications' }));
      await expect(canvas.getByText('State: off')).toBeInTheDocument();
    });
  }
};

export const Disabled: Story = {
  render: () => {
    const id = 'switch-disabled';
    return (
      <div className={styles.row}>
        <Label htmlFor={id}>Bluetooth</Label>
        <Switch id={id} disabled defaultChecked>
          <SwitchThumb />
        </Switch>
      </div>
    );
  }
};

export const InForm: Story = {
  render: () => {
    const id = 'switch-form';
    return (
      <form className={styles.stack}>
        <div className={styles.row}>
          <Label htmlFor={id}>Auto updates</Label>
          <Switch id={id} name="autoUpdates" defaultChecked>
            <SwitchThumb />
          </Switch>
        </div>
        <button className={styles.submitButton} type="submit">
          Submit
        </button>
      </form>
    );
  }
};
