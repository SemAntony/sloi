import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { DatePicker, type DatePickerSingleValue } from '../date-picker';
import { FieldMessage } from '../field-message';
import { Input } from '../input';
import { PhoneField } from '../phone-field';
import { Textarea } from '../textarea';
import styles from './form-examples.stories.module.scss';

type FormState = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  birthday: DatePickerSingleValue;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const meta = {
  title: 'UI/Patterns/Form Examples'
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const FormExamplePreview = () => {
  const [values, setValues] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    notes: '',
    birthday: undefined
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Name is required.';
    }
    if (!values.email.trim() || !values.email.includes('@')) {
      nextErrors.email = 'Enter a valid email.';
    }
    if (!values.phone.trim()) {
      nextErrors.phone = 'Phone is required.';
    }
    if (!values.birthday) {
      nextErrors.birthday = 'Pick a date.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Contact settings</h2>
      <p className={styles.description}>
        Pattern example with validation, helper messages and mixed controls.
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='name'>
            Name
          </label>
          <Input
            id='name'
            value={values.name}
            invalid={Boolean(errors.name)}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder='Your full name'
          />
          {errors.name ? <FieldMessage tone='error'>{errors.name}</FieldMessage> : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor='email'>
            Email
          </label>
          <Input
            id='email'
            type='email'
            value={values.email}
            invalid={Boolean(errors.email)}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder='you@example.com'
          />
          {errors.email ? <FieldMessage tone='error'>{errors.email}</FieldMessage> : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor='phone'>
            Phone
          </label>
          <PhoneField
            id='phone'
            value={values.phone}
            invalid={Boolean(errors.phone)}
            onValueChange={(nextValue) => updateField('phone', nextValue)}
          />
          {errors.phone ? <FieldMessage tone='error'>{errors.phone}</FieldMessage> : null}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Birthday</span>
          <DatePicker
            mode='single'
            value={values.birthday}
            onValueChange={(nextValue) => updateField('birthday', nextValue)}
            min={new Date(1940, 0, 1)}
            max={new Date()}
            placeholder='Select date'
          />
          {errors.birthday ? <FieldMessage tone='error'>{errors.birthday}</FieldMessage> : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor='notes'>
            Notes
          </label>
          <Textarea
            id='notes'
            value={values.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder='Optional context for support team'
          />
          <FieldMessage>Optional field.</FieldMessage>
        </div>

        <div className={styles.actions}>
          <Button type='submit'>Save settings</Button>
        </div>
      </form>

      {isSubmitted ? <p className={styles.success}>Form submitted successfully.</p> : null}
    </section>
  );
};

export const FormWithValidation: Story = {
  render: () => <FormExamplePreview />
};
