import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  it('marks last item as current by default', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Library', href: '#' },
          { label: 'Components' }
        ]}
      />
    );

    expect(screen.getByText('Components')).toHaveAttribute('aria-current', 'page');
  });

  it('hides separators from assistive technology', () => {
    render(
      <Breadcrumb
        separator='→'
        items={[
          { label: 'Home', href: '#' },
          { label: 'Library', href: '#' },
          { label: 'Components' }
        ]}
      />
    );

    const separators = screen.getAllByText('→');
    expect(separators).toHaveLength(2);
    for (const separator of separators) {
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('notifies controlled index changes on click', async () => {
    const user = userEvent.setup();
    const onCurrentIndexChange = vi.fn();

    render(
      <Breadcrumb
        currentIndex={2}
        onCurrentIndexChange={onCurrentIndexChange}
        items={[
          { label: 'Step 1' },
          { label: 'Step 2' },
          { label: 'Step 3' }
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Step 1' }));
    expect(onCurrentIndexChange).toHaveBeenCalledWith(0);
  });
});
