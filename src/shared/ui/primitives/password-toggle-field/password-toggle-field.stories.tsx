import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../button';
import {
  PasswordToggleField,
  PasswordToggleFieldIcon,
  PasswordToggleFieldInput,
  PasswordToggleFieldSlot,
  PasswordToggleFieldToggle
} from './password-toggle-field';
import styles from './password-toggle-field.stories.module.scss';

const meta = {
  title: 'UI/Primitives/PasswordToggleField',
  component: PasswordToggleField
} satisfies Meta<typeof PasswordToggleField>;

export default meta;

type Story = StoryObj<typeof meta>;

const VisibilityIcon = ({ visible }: { visible: boolean }) => (
  <span className={styles.iconText} aria-hidden>
    {visible ? '◉' : '○'}
  </span>
);

const AccessibilityLabel = ({ visible }: { visible: boolean }) => (
  <span className={styles.srOnly}>{visible ? 'Hide password' : 'Show password'}</span>
);

export const Default: Story = {
  render: () => (
    <PasswordToggleField className={styles.field}>
      <PasswordToggleFieldInput placeholder="Enter password" autoComplete="current-password" />
      <PasswordToggleFieldToggle>
        <PasswordToggleFieldIcon
          visible={<VisibilityIcon visible />}
          hidden={<VisibilityIcon visible={false} />}
        />
        <PasswordToggleFieldSlot
          render={({ visible }) => (
            <AccessibilityLabel visible={visible} />
          )}
        />
      </PasswordToggleFieldToggle>
    </PasswordToggleField>
  )
};

const ControlledPreview = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.stack}>
      <PasswordToggleField visible={visible} onVisibilityChange={setVisible} className={styles.field}>
        <PasswordToggleFieldInput placeholder="Controlled visibility" />
        <PasswordToggleFieldToggle>
          <PasswordToggleFieldSlot visible="SHOW" hidden="HIDE" />
          <PasswordToggleFieldSlot
            render={({ visible }) => <AccessibilityLabel visible={visible} />}
          />
        </PasswordToggleFieldToggle>
      </PasswordToggleField>

      <p className={styles.status}>Visible: {String(visible)}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

export const WithSlotRender: Story = {
  render: () => (
    <PasswordToggleField className={styles.field}>
      <PasswordToggleFieldInput placeholder="Slot render API example" />
      <PasswordToggleFieldToggle>
        <PasswordToggleFieldSlot
          render={({ visible }) => (
            <span className={styles.slotChip} aria-hidden>
              {visible ? 'Hide' : 'Show'}
            </span>
          )}
        />
        <PasswordToggleFieldSlot
          render={({ visible }) => <AccessibilityLabel visible={visible} />}
        />
      </PasswordToggleFieldToggle>
    </PasswordToggleField>
  )
};

const FormResetPreview = () => {
  const [submittedPassword, setSubmittedPassword] = useState('');

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmittedPassword(String(data.get('password') ?? ''));
      }}
      onReset={() => {
        setSubmittedPassword('');
      }}
    >
      <PasswordToggleField className={styles.field}>
        <PasswordToggleFieldInput name="password" placeholder="Submit or reset to hide value" />
        <PasswordToggleFieldToggle>
          <PasswordToggleFieldIcon
            visible={<VisibilityIcon visible />}
            hidden={<VisibilityIcon visible={false} />}
          />
          <PasswordToggleFieldSlot
            render={({ visible }) => <AccessibilityLabel visible={visible} />}
          />
        </PasswordToggleFieldToggle>
      </PasswordToggleField>

      <div className={styles.formActions}>
        <Button type="submit" variant="secondary">Submit</Button>
        <Button type="reset" variant="ghost">Reset</Button>
      </div>

      <p className={styles.status}>Last submitted: {submittedPassword || 'none'}</p>
    </form>
  );
};

export const FormResetBehavior: Story = {
  render: () => <FormResetPreview />
};
