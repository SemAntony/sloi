import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from './dialog';

describe('Dialog a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Dialog open onOpenChange={() => undefined}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Delete item</DialogTitle>
            <DialogDescription>Deletion cannot be undone.</DialogDescription>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('keeps closed state accessible and does not expose dialog role', async () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Delete item</DialogTitle>
            <DialogDescription>Deletion cannot be undone.</DialogDescription>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
