import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

  describe('loading', () => {
    it('по умолчанию не ставит aria-busy и aria-disabled', () => {
      render(<Button>Save</Button>);

      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).not.toHaveAttribute('aria-busy');
      expect(button).not.toHaveAttribute('aria-disabled');
      expect(button).not.toHaveClass(styles.loading);
    });

    it('ставит aria-busy, aria-disabled и класс, но не нативный disabled', () => {
      render(<Button loading>Save</Button>);

      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveClass(styles.loading);
      expect(button).toBeEnabled();
    });

    it('остаётся фокусируемой и сохраняет имя', async () => {
      const user = userEvent.setup();
      render(<Button loading>Save</Button>);

      await user.tab();
      expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    });

    it('блокирует onClick по клику мышью, Enter и Space', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>
      );

      const button = screen.getByRole('button', { name: 'Save' });
      await user.click(button);
      button.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      expect(onClick).not.toHaveBeenCalled();
    });

    it('не отправляет форму', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button type='submit' loading>
            Send
          </Button>
        </form>
      );

      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('после loading={false} клики снова работают', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { rerender } = render(
        <Button loading onClick={onClick}>
          Save
        </Button>
      );

      rerender(
        <Button loading={false} onClick={onClick}>
          Save
        </Button>
      );
      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).not.toHaveAttribute('aria-busy');
      await user.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disabled вместе с loading тоже не вызывает onClick', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading disabled onClick={onClick}>
          Save
        </Button>
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('работает с asChild: aria-busy и отмена перехода по ссылке', () => {
      render(
        <Button asChild loading>
          <a href='/docs'>Open docs</a>
        </Button>
      );

      const link = screen.getByRole('link', { name: 'Open docs' });
      expect(link).toHaveAttribute('aria-busy', 'true');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(fireEvent.click(link)).toBe(false);
    });

    it('iconOnly сохраняет имя из aria-label', () => {
      render(
        <Button loading iconOnly aria-label='Refresh'>
          <svg aria-hidden='true' />
        </Button>
      );

      expect(screen.getByRole('button', { name: 'Refresh' })).toHaveAttribute('aria-busy', 'true');
    });

    it('пробрасывает ref', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Button ref={ref} loading>
          Save
        </Button>
      );

      expect(ref.current).toBe(screen.getByRole('button', { name: 'Save' }));
    });
  });

  describe('danger', () => {
    it('применяет класс варианта danger', () => {
      render(<Button variant='danger'>Delete</Button>);

      expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(styles.variantDanger);
    });

    it('другие варианты не получают класс danger', () => {
      render(<Button>Save</Button>);

      expect(screen.getByRole('button', { name: 'Save' })).not.toHaveClass(styles.variantDanger);
    });

    it('работает с loading и disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <>
          <Button variant='danger' loading onClick={onClick}>
            Deleting
          </Button>
          <Button variant='danger' disabled onClick={onClick}>
            Delete
          </Button>
        </>
      );

      await user.click(screen.getByRole('button', { name: 'Deleting' }));
      await user.click(screen.getByRole('button', { name: 'Delete' }));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('слоты иконок', () => {
    it('рендерит startIcon перед текстом и endIcon после, оба aria-hidden', () => {
      render(
        <Button startIcon={<svg data-testid='start' />} endIcon={<svg data-testid='end' />}>
          Next
        </Button>
      );

      const button = screen.getByRole('button', { name: 'Next' });
      const start = screen.getByTestId('start');
      const end = screen.getByTestId('end');
      expect(start.parentElement).toHaveAttribute('aria-hidden', 'true');
      expect(end.parentElement).toHaveAttribute('aria-hidden', 'true');
      expect(start.parentElement).toHaveClass(styles.icon);
      expect(button.firstElementChild).toBe(start.parentElement);
      expect(button.lastElementChild).toBe(end.parentElement);
      expect(button).toHaveTextContent('Next');
    });

    it('иконки не меняют доступное имя', () => {
      render(
        <Button startIcon={<svg data-testid='start' />}>
          Add item
        </Button>
      );

      expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
    });

    it('без слотов не добавляет обёрток', () => {
      render(<Button>Plain</Button>);

      expect(screen.getByRole('button', { name: 'Plain' }).children).toHaveLength(0);
    });

    it('при loading стартовая иконка заменяется спиннером, конечная остаётся', () => {
      render(
        <Button loading startIcon={<svg data-testid='start' />} endIcon={<svg data-testid='end' />}>
          Save
        </Button>
      );

      expect(screen.queryByTestId('start')).not.toBeInTheDocument();
      expect(screen.getByTestId('end')).toBeInTheDocument();
    });

    it('работает с asChild: иконки внутри ссылки, ссылка остаётся одним элементом', () => {
      render(
        <Button asChild startIcon={<svg data-testid='start' />} endIcon={<svg data-testid='end' />}>
          <a href='/docs'>Open docs</a>
        </Button>
      );

      const link = screen.getByRole('link', { name: 'Open docs' });
      expect(link).toHaveAttribute('href', '/docs');
      expect(link).toContainElement(screen.getByTestId('start'));
      expect(link).toContainElement(screen.getByTestId('end'));
      expect(link.firstElementChild).toBe(screen.getByTestId('start').parentElement);
    });
  });
});
