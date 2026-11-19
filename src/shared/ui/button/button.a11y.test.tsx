import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from './button';

describe('Button a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Button>Submit</Button>);
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations for disabled secondary variant', async () => {
    const { container } = render(
      <Button variant='secondary' disabled>
        Save
      </Button>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations while loading', async () => {
    const { container } = render(
      <>
        <Button loading>Save</Button>
        <Button loading iconOnly aria-label='Refresh'>
          <svg aria-hidden='true' />
        </Button>
      </>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations for danger variant with icon slots', async () => {
    const { container } = render(
      <>
        <Button variant='danger'>Delete</Button>
        <Button startIcon={<svg />} endIcon={<svg />}>
          Next
        </Button>
        <Button asChild startIcon={<svg />}>
          <a href='/docs'>Docs</a>
        </Button>
      </>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
