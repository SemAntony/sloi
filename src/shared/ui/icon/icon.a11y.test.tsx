import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Icon } from './icon';
import { IconBell, IconSearch } from './icons';

describe('Icon a11y', () => {
  it('has no detectable accessibility violations for informative icon', async () => {
    const { container } = render(
      <button type='button'>
        <Icon icon={IconSearch} decorative={false} label='Search' />
      </button>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations for decorative icon with text label', async () => {
    const { container } = render(
      <button type='button'>
        <Icon icon={IconSearch} />
        Search incidents
      </button>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations for icon-only informative control', async () => {
    const { container } = render(
      <button type='button'>
        <Icon icon={IconBell} decorative={false} label='Notifications' />
      </button>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
