import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from './toast';

describe('Toast a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <ToastProvider>
        <Toast open onOpenChange={() => undefined}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Profile updated successfully.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('keeps closed toast state accessible and does not expose live region content', async () => {
    const { container } = render(
      <ToastProvider>
        <Toast open={false} onOpenChange={() => undefined}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Profile updated successfully.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
