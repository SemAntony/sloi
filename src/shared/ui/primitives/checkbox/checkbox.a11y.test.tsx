import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './checkbox';

describe('Checkbox a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Checkbox aria-label='Accept terms' />);
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations in described mixed state', async () => {
    const { container } = render(
      <fieldset>
        <legend>Terms</legend>
        <p id='terms-help'>Accepting terms is required.</p>
        <Checkbox aria-label='Accept terms' aria-describedby='terms-help' checked='indeterminate' />
      </fieldset>
    );

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
