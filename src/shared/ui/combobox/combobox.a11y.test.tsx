import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Combobox } from './combobox';

describe('Combobox a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Combobox
        options={[
          { value: 'am', label: 'Armenia' },
          { value: 'de', label: 'Germany' }
        ]}
      />
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
