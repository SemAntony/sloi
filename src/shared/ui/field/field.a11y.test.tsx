import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from '../input';
import { Select, SelectTrigger, SelectValue } from '../primitives/select';
import { Textarea } from '../textarea';
import { Field } from './field';

const options = { rules: { 'color-contrast': { enabled: false } } };

describe('Field a11y', () => {
  it('has no violations: label, hint, error, required', async () => {
    const { container } = render(
      <div>
        <Field label='Email' hint='We never share it' error='Enter a valid email' required>
          <Input defaultValue='bad' />
        </Field>
        <Field label='Bio' hint='Short'>
          <Textarea />
        </Field>
      </div>
    );

    expect((await axe(container, options)).violations).toHaveLength(0);
  });

  it('has no violations with SelectTrigger', async () => {
    const { container } = render(
      <Field label='Role' error='Required'>
        <Select>
          <SelectTrigger fullWidth>
            <SelectValue placeholder='Choose' />
          </SelectTrigger>
        </Select>
      </Field>
    );

    expect((await axe(container, options)).violations).toHaveLength(0);
  });
});
