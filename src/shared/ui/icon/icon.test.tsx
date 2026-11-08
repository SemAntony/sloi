import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from './icon';
import { IconBell } from './icons';

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon icon={IconBell} data-testid='icon' />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('provides accessible text when decorative is false', () => {
    render(<Icon icon={IconBell} decorative={false} label='Notifications' />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('uses current tone by default for color inheritance', () => {
    const { container } = render(<Icon icon={IconBell} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-tone', 'current');
  });

  it('exposes tone and size as stable attributes for styling/debugging', () => {
    const { container } = render(<Icon icon={IconBell} tone='danger' size='lg' />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-tone', 'danger');
    expect(svg).toHaveAttribute('data-size', 'lg');
  });

  it('logs runtime warning when informative icon has no label', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Runtime safety check for non-TypeScript consumers.
    render(<Icon icon={IconBell} decorative={false} label={undefined as never} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Icon: `label` is required when `decorative` is false.'
    );
    consoleErrorSpy.mockRestore();
  });
});
