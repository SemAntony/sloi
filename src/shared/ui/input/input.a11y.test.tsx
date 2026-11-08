import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from './input';

describe('Input a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Input aria-label='Name' placeholder='Jane Doe' />);
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations with described error state', async () => {
    const { container } = render(
      <div>
        <label htmlFor='email'>Email</label>
        <Input id='email' invalid aria-describedby='email-error' defaultValue='bad-email' />
        <p id='email-error'>Enter a valid email address.</p>
      </div>
    );

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
