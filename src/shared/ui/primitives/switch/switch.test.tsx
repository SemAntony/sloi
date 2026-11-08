import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch, SwitchThumb } from './switch';

describe('Switch', () => {
  it('toggles checked state', async () => {
    const user = userEvent.setup();

    render(
      <Switch aria-label='Enable notifications'>
        <SwitchThumb />
      </Switch>
    );

    const control = screen.getByRole('switch', { name: 'Enable notifications' });
    expect(control).toHaveAttribute('aria-checked', 'false');

    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onCheckedChange in controlled mode', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Switch aria-label='Controlled switch callback' checked={false} onCheckedChange={onCheckedChange}>
        <SwitchThumb />
      </Switch>
    );

    await user.click(screen.getByRole('switch', { name: 'Controlled switch callback' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('supports keyboard toggling', async () => {
    const user = userEvent.setup();

    render(
      <Switch aria-label='Keyboard switch'>
        <SwitchThumb />
      </Switch>
    );

    const control = screen.getByRole('switch', { name: 'Keyboard switch' });
    control.focus();
    await user.keyboard('{Enter}');
    expect(control).toHaveAttribute('aria-checked', 'true');
  });

  it('keeps disabled switch non-interactive', async () => {
    const user = userEvent.setup();

    render(
      <Switch aria-label='Disabled switch' disabled>
        <SwitchThumb />
      </Switch>
    );

    const control = screen.getByRole('switch', { name: 'Disabled switch' });
    expect(control).toHaveAttribute('data-disabled', '');
    expect(control).toHaveAttribute('aria-checked', 'false');

    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('submits checked value through form integration', async () => {
    const user = userEvent.setup();
    let submittedValue: FormDataEntryValue | null = null;

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          submittedValue = data.get('notifications');
        }}
      >
        <Switch aria-label='Form switch' name='notifications' value='enabled' defaultChecked>
          <SwitchThumb />
        </Switch>
        <button type='submit'>Submit</button>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(submittedValue).toBe('enabled');
  });
});
