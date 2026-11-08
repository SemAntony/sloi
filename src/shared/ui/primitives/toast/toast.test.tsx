import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from './toast';

describe('Toast', () => {
  it('renders toast content and action controls', () => {
    render(
      <ToastProvider>
        <Toast open onOpenChange={() => undefined}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Profile updated successfully.</ToastDescription>
          <ToastAction altText='Undo save'>
            Undo
          </ToastAction>
          <ToastClose aria-label='Close'>Close</ToastClose>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onOpenChange when closing via close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ToastProvider>
        <Toast open onOpenChange={onOpenChange}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Profile updated successfully.</ToastDescription>
          <ToastClose aria-label='Close'>Close</ToastClose>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not render toast content when open is false', () => {
    render(
      <ToastProvider>
        <Toast open={false} onOpenChange={() => undefined}>
          <ToastTitle>Hidden toast</ToastTitle>
          <ToastDescription>Should not be visible.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.queryByText('Hidden toast')).not.toBeInTheDocument();
  });

  it('invokes action callback', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();

    render(
      <ToastProvider>
        <Toast open onOpenChange={() => undefined}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Profile updated successfully.</ToastDescription>
          <ToastAction altText='Undo save' onClick={onUndo}>
            Undo
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('supports custom viewport label contract', () => {
    render(
      <ToastProvider>
        <Toast open onOpenChange={() => undefined}>
          <ToastTitle>Labeled viewport toast</ToastTitle>
          <ToastDescription>Check viewport label.</ToastDescription>
        </Toast>
        <ToastViewport hotkey={['altKey', 'KeyT']} label='Notifications (Alt+T)' />
      </ToastProvider>
    );

    expect(screen.getByRole('region', { name: 'Notifications (Alt+T)' })).toBeInTheDocument();
  });
});
