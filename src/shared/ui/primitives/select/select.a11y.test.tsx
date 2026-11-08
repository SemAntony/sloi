import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from './select';

describe('Select a11y', () => {
  it('has no detectable accessibility violations in closed state', async () => {
    const { container } = render(
      <Select value='apple'>
        <SelectTrigger aria-label='Food'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectViewport>
            <SelectItem value='apple'>Apple</SelectItem>
            <SelectItem value='banana'>Banana</SelectItem>
          </SelectViewport>
        </SelectContent>
      </Select>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations in open state', async () => {
    const { container } = render(
      <Select open onOpenChange={() => undefined} value='apple'>
        <SelectTrigger aria-label='Food'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectViewport>
            <SelectItem value='apple'>Apple</SelectItem>
            <SelectItem value='banana'>Banana</SelectItem>
          </SelectViewport>
        </SelectContent>
      </Select>
    );

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
