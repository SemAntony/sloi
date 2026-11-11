import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { cn } from '../../../lib/cn/cn';
import { Button } from '../../button';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit,
  FormValidityState
} from './form';
import styles from './form.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Form',
  component: Form
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form
      className={styles.demoRoot}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <FormField name="email">
        <div className={styles.fieldHeader}>
          <FormLabel>Email</FormLabel>
          <FormMessage match="valueMissing">Please enter your email</FormMessage>
          <FormMessage match="typeMismatch">Please provide a valid email</FormMessage>
        </div>
        <FormControl type="email" required placeholder="you@sloi.dev" />
      </FormField>

      <FormField name="question">
        <div className={styles.fieldHeader}>
          <FormLabel>Question</FormLabel>
          <FormMessage match="valueMissing">Please enter a question</FormMessage>
        </div>
        <FormControl asChild>
          <textarea className={styles.textarea} required placeholder="How does this component handle server errors?" />
        </FormControl>
      </FormField>

      <FormSubmit asChild>
        <Button type="submit">Post question</Button>
      </FormSubmit>
    </Form>
  )
};

export const CustomValidation: Story = {
  render: () => (
    <Form
      className={styles.demoRoot}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <FormField name="password">
        <FormLabel>Password</FormLabel>
        <FormControl type="password" minLength={8} required placeholder="At least 8 characters" />
        <FormMessage match="valueMissing">Please provide a password</FormMessage>
        <FormMessage match="tooShort">Password should be at least 8 characters</FormMessage>
      </FormField>

      <FormField name="confirmPassword">
        <FormLabel>Confirm password</FormLabel>
        <FormControl type="password" required placeholder="Repeat password" />
        <FormMessage match="valueMissing">Please confirm your password</FormMessage>
        <FormMessage
          match={(value, formData) => {
            const password = String(formData.get('password') ?? '');
            return value !== password;
          }}
        >
          Passwords must match
        </FormMessage>
      </FormField>

      <p className={styles.helperText}>Custom matcher runs after built-in constraints are satisfied.</p>

      <FormSubmit asChild>
        <Button type="submit">Create account</Button>
      </FormSubmit>
    </Form>
  )
};

const ServerValidationPreview = () => {
  const [serverErrors, setServerErrors] = useState({
    email: false,
    question: false
  });
  const [submissionState, setSubmissionState] = useState<'idle' | 'success'>('idle');

  return (
    <Form
      className={styles.demoRoot}
      onSubmit={(event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const email = String(data.email ?? '');
        const question = String(data.question ?? '');

        const nextErrors = {
          email: !email.endsWith('@sloi.dev'),
          question: /\b(hack|exploit)\b/i.test(question)
        };

        setServerErrors(nextErrors);
        setSubmissionState(nextErrors.email || nextErrors.question ? 'idle' : 'success');
      }}
      onClearServerErrors={() => {
        setServerErrors({ email: false, question: false });
        setSubmissionState('idle');
      }}
    >
      <FormField name="email" serverInvalid={serverErrors.email}>
        <div className={styles.fieldHeader}>
          <FormLabel>Work email</FormLabel>
          <FormMessage match="valueMissing">Please enter your email</FormMessage>
          <FormMessage match="typeMismatch">Please provide a valid email</FormMessage>
          <FormMessage match="typeMismatch" forceMatch={serverErrors.email}>
            Use a company email on @sloi.dev
          </FormMessage>
        </div>
        <FormControl
          type="email"
          required
          placeholder="name@sloi.dev"
          onChange={() => setServerErrors((prev) => ({ ...prev, email: false }))}
        />
      </FormField>

      <FormField name="question" serverInvalid={serverErrors.question}>
        <div className={styles.fieldHeader}>
          <FormLabel>Question</FormLabel>
          <FormMessage match="valueMissing">Please enter a question</FormMessage>
          {serverErrors.question && <FormMessage>Please remove blocked keywords and try again.</FormMessage>}
        </div>
        <FormControl asChild>
          <textarea
            className={styles.textarea}
            required
            placeholder={'Avoid words like "hack" or "exploit" for this demo.'}
            onChange={() => setServerErrors((prev) => ({ ...prev, question: false }))}
          />
        </FormControl>
      </FormField>

      <FormSubmit asChild>
        <Button type="submit">Send for moderation</Button>
      </FormSubmit>

      <p className={cn(styles.status, submissionState === 'success' && styles.statusSuccess)}>
        {submissionState === 'success'
          ? 'Form passed server-side validation.'
          : 'Try a non-sloi.dev email or blocked keywords to trigger server errors.'}
      </p>
    </Form>
  );
};

export const ServerValidation: Story = {
  render: () => <ServerValidationPreview />
};

const ValidityStatePreview = () => (
  <Form
    className={styles.demoRoot}
    onSubmit={(event) => {
      event.preventDefault();
    }}
  >
    <FormField name="projectUrl">
      <div className={styles.fieldHeader}>
        <FormLabel>Project URL</FormLabel>
        <FormValidityState>
          {(validity) => (
            <span
              className={cn(
                styles.validityPill,
                validity?.valid && styles.validityPillValid,
                validity && !validity.valid && styles.validityPillInvalid
              )}
            >
              {validity?.valid ? 'Valid URL' : 'Needs validation'}
            </span>
          )}
        </FormValidityState>
      </div>

      <FormControl type="url" required placeholder="https://example.com" />
      <FormMessage match="valueMissing">Please enter a URL</FormMessage>
      <FormMessage match="typeMismatch">URL must include protocol (https://...)</FormMessage>
      <FormValidityState>
        {(validity) => (
          <ul className={styles.validityList}>
            <li className={cn(validity?.valueMissing && styles.validityListItemActive)}>
              `valueMissing`: {String(validity?.valueMissing ?? false)}
            </li>
            <li className={cn(validity?.typeMismatch && styles.validityListItemActive)}>
              `typeMismatch`: {String(validity?.typeMismatch ?? false)}
            </li>
            <li className={cn(validity?.valid && styles.validityListItemActive)}>
              `valid`: {String(validity?.valid ?? false)}
            </li>
          </ul>
        )}
      </FormValidityState>
    </FormField>

    <FormSubmit>Submit</FormSubmit>
  </Form>
);

export const ValidityState: Story = {
  render: () => <ValidityStatePreview />
};
