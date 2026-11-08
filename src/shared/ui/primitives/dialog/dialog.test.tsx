import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from './dialog';

const DialogHarness = () => (
  <Dialog>
    <DialogTrigger>Open dialog</DialogTrigger>
    <DialogPortal>
      <DialogOverlay data-testid='dialog-overlay' />
      <DialogContent>
        <DialogTitle>Delete item</DialogTitle>
        <DialogDescription>Deletion cannot be undone.</DialogDescription>
        <DialogCloseButton>Close</DialogCloseButton>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);

describe('Dialog', () => {
  it('opens and closes through trigger and close button', async () => {
    const user = userEvent.setup();

    render(<DialogHarness />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('emits open state changes in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogTrigger>Open controlled dialog</DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Controlled title</DialogTitle>
            <DialogDescription>Controlled description</DialogDescription>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: 'Open controlled dialog' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogTrigger>Open controlled dialog</DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Controlled title</DialogTitle>
            <DialogDescription>Controlled description</DialogDescription>
            <DialogCloseButton label='Close controlled dialog'>Close controlled dialog</DialogCloseButton>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: 'Close controlled dialog' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on Escape and restores focus to trigger', async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('closes on overlay click', async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByTestId('dialog-overlay'));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
