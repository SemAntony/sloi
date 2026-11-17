import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip, TooltipProvider } from './tooltip';

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

describe('Tooltip shared TooltipProvider (D13)', () => {
  it('под общим Provider задержка берётся из Provider, а не из значения по умолчанию у Tooltip', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={10_000}>
        <Tooltip content='Slow tooltip'>
          <button type='button'>Slow target</button>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Slow target' }));
    await new Promise((resolve) => setTimeout(resolve, 450));

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('явный delayDuration у Tooltip перекрывает Provider', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={10_000}>
        <Tooltip delayDuration={0} content='Fast tooltip'>
          <button type='button'>Fast target</button>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Fast target' }));

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Fast tooltip');
  });

  it('skipDelayDuration работает между подсказками: вторая открывается без задержки', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={10_000} skipDelayDuration={1_000}>
        <Tooltip content='Tip A'>
          <button type='button'>Target A</button>
        </Tooltip>
        <Tooltip content='Tip B'>
          <button type='button'>Target B</button>
        </Tooltip>
      </TooltipProvider>
    );

    // фокус открывает подсказку сразу и «прогревает» Provider
    screen.getByRole('button', { name: 'Target A' }).focus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Tip A');

    await user.hover(screen.getByRole('button', { name: 'Target B' }));

    expect(screen.queryAllByText('Tip B').length).toBeGreaterThan(0);
  });

  it('без общего Provider каждая подсказка работает сама (обратная совместимость)', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip delayDuration={0} content='Standalone'>
        <button type='button'>Standalone target</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Standalone target' }));

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Standalone');
  });
});
