import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { DatePicker } from './date-picker';

describe('DatePicker a11y', () => {
  it('has no detectable accessibility violations in default state', async () => {
    const { container } = render(<DatePicker mode='single' placeholder='Pick date' />);
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
