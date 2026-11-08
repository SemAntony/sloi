import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';
import styles from './button.module.scss';

describe('Button', () => {
  it('renders as a native button with default type', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('supports explicit button type override', () => {
    render(<Button type='submit'>Submit</Button>);

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('supports asChild rendering', () => {
    render(
      <Button asChild>
        <a href='/docs'>Open docs</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Open docs' });
    expect(link).toHaveAttribute('href', '/docs');
  });

  it('applies variant/size/fullWidth styling contract classes', () => {
    render(
      <Button variant='secondary' size='lg' fullWidth>
        Full width action
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Full width action' });
    expect(button).toHaveClass(styles.variantSecondary);
    expect(button).toHaveClass(styles.sizeLg);
    expect(button).toHaveClass(styles.fullWidth);
  });

  it('does not invoke onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Disabled action
      </Button>
    );

    await user.click(screen.getByRole('button', { name: 'Disabled action' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
