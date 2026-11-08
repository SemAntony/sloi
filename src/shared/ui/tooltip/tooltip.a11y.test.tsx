import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Tooltip } from './tooltip';

describe('Tooltip a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Tooltip open onOpenChange={() => undefined} delayDuration={0} content='Helpful tooltip'>
        <button type='button'>Target</button>
      </Tooltip>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('keeps closed state accessible and does not expose tooltip role', async () => {
    const { container } = render(
      <Tooltip delayDuration={0} content='Helpful tooltip'>
        <button type='button'>Target</button>
      </Tooltip>
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
