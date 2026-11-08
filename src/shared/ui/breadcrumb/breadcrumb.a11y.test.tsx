import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Dashboard', href: '#' },
          { label: 'Current page' }
        ]}
      />
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
