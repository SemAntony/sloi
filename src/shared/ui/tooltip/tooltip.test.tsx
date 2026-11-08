import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip } from './tooltip';

describe('Tooltip', () => {
  it('renders content in controlled open mode', async () => {
    render(
      <Tooltip
        open
        onOpenChange={() => undefined}
        delayDuration={0}
        content='Helpful tooltip'
      >
        <button type='button'>Target</button>
      </Tooltip>
    );

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Helpful tooltip');
  });

  it('opens on hover and closes on unhover in uncontrolled mode', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip delayDuration={0} disableHoverableContent content='Uncontrolled tooltip'>
        <button type='button'>Hover target</button>
      </Tooltip>
    );

    const target = screen.getByRole('button', { name: 'Hover target' });
    await user.hover(target);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Uncontrolled tooltip');

    await user.unhover(target);
    await waitFor(() => {
      expect(target).toHaveAttribute('data-state', 'closed');
    });
  });

  it('emits open state changes in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Tooltip open={false} onOpenChange={onOpenChange} delayDuration={0} content='Controlled tooltip'>
        <button type='button'>Controlled target</button>
      </Tooltip>
    );

    const target = screen.getByRole('button', { name: 'Controlled target' });
    await user.hover(target);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('opens on focus and closes on blur', async () => {
    render(
      <Tooltip delayDuration={0} content='Focus tooltip'>
        <button type='button'>Focus target</button>
      </Tooltip>
    );

    const target = screen.getByRole('button', { name: 'Focus target' });
    target.focus();

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Focus tooltip');

    target.blur();
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('renders portal content inside custom container', async () => {
    const portalContainer = document.createElement('div');
    document.body.append(portalContainer);

    render(
      <Tooltip
        open
        onOpenChange={() => undefined}
        delayDuration={0}
        content='Container tooltip'
        container={portalContainer}
      >
        <button type='button'>Container target</button>
      </Tooltip>
    );

    const tooltip = await screen.findByRole('tooltip');
    expect(portalContainer.contains(tooltip)).toBe(true);
  });
});
