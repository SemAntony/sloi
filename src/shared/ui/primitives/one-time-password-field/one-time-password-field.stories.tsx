import type { Meta, StoryObj } from '@storybook/react';
import { Fragment, useState } from 'react';
import { Button } from '../../button';
import {
  OneTimePasswordField,
  OneTimePasswordFieldHiddenInput,
  OneTimePasswordFieldInput
} from './one-time-password-field';
import styles from './one-time-password-field.stories.module.scss';

const OTP_LENGTH = 6;

const meta = {
  title: 'UI/Primitives/OneTimePasswordField',
  component: OneTimePasswordField,
  tags: ['experimental'],
  parameters: {
    docs: {
      description: {
        component:
          '**Experimental.** Обёртка над `unstable_OneTimePasswordField` из radix-ui: API может измениться в minor-релизах и не считается semver-stable до выхода из эксперимента.'
      }
    }
  }
} satisfies Meta<typeof OneTimePasswordField>;

export default meta;

type Story = StoryObj<typeof meta>;

const OTPInputs = ({ length = OTP_LENGTH }: { length?: number }) => (
  <>
    {Array.from({ length }).map((_, index) => (
      <OneTimePasswordFieldInput key={index} index={index} aria-label={`Character ${index + 1}`} />
    ))}
    <OneTimePasswordFieldHiddenInput />
  </>
);

export const Default: Story = {
  render: () => (
    <OneTimePasswordField
      className={styles.otpRoot}
      name="otp"
      defaultValue="194"
      validationType="numeric"
      autoComplete="one-time-code"
    >
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <Fragment key={index}>
          <OneTimePasswordFieldInput index={index} aria-label={`Digit ${index + 1}`} />
          {index === 2 && <span className={styles.segmentSeparator} aria-hidden>—</span>}
        </Fragment>
      ))}
      <OneTimePasswordFieldHiddenInput />
    </OneTimePasswordField>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState('');

  return (
    <div className={styles.stack}>
      <OneTimePasswordField
        className={styles.otpRoot}
        value={value}
        onValueChange={setValue}
        validationType="numeric"
        autoComplete="one-time-code"
      >
        <OTPInputs />
      </OneTimePasswordField>

      <p className={styles.status}>Value: {value || 'empty'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

export const Alphanumeric: Story = {
  render: () => (
    <OneTimePasswordField
      className={styles.otpRoot}
      defaultValue="A1B2"
      validationType="alphanumeric"
      placeholder="ABC123"
      autoComplete="off"
    >
      <OTPInputs />
    </OneTimePasswordField>
  )
};

const AutoSubmitPreview = () => {
  const [status, setStatus] = useState('Waiting for full code');

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const code = String(data.get('otp') ?? '');
        setStatus(`Submitted code: ${code || 'empty'}`);
      }}
    >
      <OneTimePasswordField
        className={styles.otpRoot}
        name="otp"
        autoSubmit
        onAutoSubmit={(value) => {
          setStatus(`Auto submit triggered for: ${value}`);
        }}
      >
        <OTPInputs />
      </OneTimePasswordField>

      <div className={styles.formActions}>
        <Button type="submit" variant="secondary">Submit manually</Button>
        <span className={styles.status}>{status}</span>
      </div>
    </form>
  );
};

export const AutoSubmit: Story = {
  render: () => <AutoSubmitPreview />
};

export const Vertical: Story = {
  render: () => (
    <OneTimePasswordField className={styles.verticalRoot} orientation="vertical">
      <OTPInputs length={4} />
    </OneTimePasswordField>
  )
};
