import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal, type ModalProps } from './modal';

const StatefulModal = (props: Partial<ModalProps>) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type='button' onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title='Delete item' {...props}>
        <p>Deletion cannot be undone.</p>
        <button type='button'>Confirm</button>
      </Modal>
    </>
  );
};

/**
 * У Modal есть exit-анимация (CSS), и Radix Presence держит узел в DOM до `animationend`.
 * jsdom анимаций не проигрывает, поэтому завершаем их вручную, как это сделал бы браузер.
 */
const finishExitAnimations = () => {
  act(() => {
    for (const node of document.querySelectorAll("[data-state='closed']")) {
      const event = new Event('animationend', { bubbles: true });
      Object.defineProperty(event, 'animationName', { value: getComputedStyle(node).animationName });
      node.dispatchEvent(event);
    }
  });
};

describe('Modal (D17)', () => {
  it('renders nothing while closed', () => {
    render(
      <Modal open={false} title='Hidden'>
        Body
      </Modal>
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders a dialog named by the title with its children when open', () => {
    render(
      <Modal open title='Delete item'>
        <p>Deletion cannot be undone.</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'Delete item' });
    expect(dialog).toHaveTextContent('Deletion cannot be undone.');
  });

  it('falls back to a visually hidden title so the dialog always has a name', () => {
    render(<Modal open>Body</Modal>);

    expect(screen.getByRole('dialog', { name: 'Modal' })).toBeInTheDocument();
  });

  it('shows a Close button by default and can hide it', () => {
    const { rerender } = render(
      <Modal open title='T'>
        Body
      </Modal>
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();

    rerender(
      <Modal open title='T' closeButton={false}>
        Body
      </Modal>
    );
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('close button reports onClose and onOpenChange(false)', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Modal open title='T' onClose={onClose} onOpenChange={onOpenChange}>
        Body
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Escape closes the modal', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open title='T' onClose={onClose}>
        Body
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('a click on the overlay closes the modal, a click inside does not', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open title='T' onClose={onClose} overlayClassName='test-overlay'>
        <p>Inside</p>
      </Modal>
    );

    await user.click(screen.getByText('Inside'));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(document.querySelector('.test-overlay') as HTMLElement);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('is controlled: stays open until the open prop changes', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal open title='T' onClose={onClose}>
        Body
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(
      <Modal open={false} title='T' onClose={onClose}>
        Body
      </Modal>
    );
    finishExitAnimations();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('moves focus into the dialog and returns it to the opener on close', async () => {
    const user = userEvent.setup();
    render(<StatefulModal />);

    const opener = screen.getByRole('button', { name: 'Open modal' });
    await user.click(opener);

    const dialog = await screen.findByRole('dialog', { name: 'Delete item' });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    await user.keyboard('{Escape}');
    finishExitAnimations();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('keeps Tab focus inside the dialog', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Outside</button>
        <Modal open title='T'>
          <button type='button'>Confirm</button>
        </Modal>
      </>
    );

    for (let step = 0; step < 4; step += 1) {
      await user.tab();
      expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    }
  });

  it('has no aria-describedby by default but allows passing one', () => {
    const { rerender } = render(
      <Modal open title='T'>
        Body
      </Modal>
    );
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');

    rerender(
      <>
        <p id='hint'>Hint</p>
        <Modal open title='T' aria-describedby='hint'>
          Body
        </Modal>
      </>
    );
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Hint');
  });

  it('applies className and overlayClassName and renders into a custom container', () => {
    const container = document.createElement('div');
    container.id = 'custom-root';
    document.body.append(container);

    render(
      <Modal open title='T' className='content-extra' overlayClassName='overlay-extra' container={container}>
        Body
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('content-extra');
    expect(container.contains(dialog)).toBe(true);
    expect(container.querySelector('.overlay-extra')).not.toBeNull();

    container.remove();
  });

  it('lets onCloseAutoFocus take over focus handling by calling preventDefault', async () => {
    const user = userEvent.setup();
    render(<StatefulModal onCloseAutoFocus={(event) => event.preventDefault()} />);

    const opener = screen.getByRole('button', { name: 'Open modal' });
    await user.click(opener);
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');
    finishExitAnimations();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    expect(opener).not.toHaveFocus();
  });
});

