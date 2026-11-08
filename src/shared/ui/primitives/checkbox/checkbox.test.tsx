import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('toggles checked state on click', async () => {
    const user = userEvent.setup();

    render(
      <label>
        <Checkbox aria-label='Accept terms' />
      </label>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('emits checked changes in controlled mode', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox
        aria-label='Controlled'
        checked={false}
        onCheckedChange={onCheckedChange}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Controlled' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled checked value', () => {
    render(
      <Checkbox aria-label='Controlled checked checkbox' checked onCheckedChange={() => undefined} />
    );

    expect(screen.getByRole('checkbox', { name: 'Controlled checked checkbox' })).toHaveAttribute('aria-checked', 'true');
  });

  it('keeps disabled checkbox non-interactive', async () => {
    const user = userEvent.setup();

    render(<Checkbox aria-label='Disabled checkbox' disabled />);

    const checkbox = screen.getByRole('checkbox', { name: 'Disabled checkbox' });
    expect(checkbox).toHaveAttribute('data-disabled', '');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('emits checked change from indeterminate state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox aria-label='Partial selection' checked='indeterminate' onCheckedChange={onCheckedChange} />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Partial selection' });
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');

    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
