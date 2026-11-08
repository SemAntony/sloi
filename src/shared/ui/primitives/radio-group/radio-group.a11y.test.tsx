import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <RadioGroup defaultValue='daily' aria-label='Notifications frequency'>
        <RadioGroupItem value='daily' aria-label='Daily' />
        <RadioGroupItem value='weekly' aria-label='Weekly' />
      </RadioGroup>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations with description and horizontal orientation', async () => {
    const { container } = render(
      <fieldset>
        <legend>Notifications</legend>
        <p id='notifications-help'>Choose update frequency.</p>
        <RadioGroup
          defaultValue='daily'
          orientation='horizontal'
          aria-label='Notifications frequency horizontal'
          aria-describedby='notifications-help'
        >
          <RadioGroupItem value='daily' aria-label='Daily' />
          <RadioGroupItem value='weekly' aria-label='Weekly' />
        </RadioGroup>
      </fieldset>
    );

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
