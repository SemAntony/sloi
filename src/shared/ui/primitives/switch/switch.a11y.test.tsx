import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Switch, SwitchThumb } from './switch';

describe('Switch a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Switch aria-label='Enable notifications'>
        <SwitchThumb />
      </Switch>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations with description and checked state', async () => {
    const { container } = render(
      <div>
        <p id='switch-help'>You can disable notifications later.</p>
        <Switch aria-label='Enable notifications' aria-describedby='switch-help' defaultChecked>
          <SwitchThumb />
        </Switch>
      </div>
    );

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
