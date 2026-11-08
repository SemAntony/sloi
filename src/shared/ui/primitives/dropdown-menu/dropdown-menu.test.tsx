import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './dropdown-menu';

const DropdownMenuHarness = ({
  disabledDelete = false,
  onDeleteSelect,
  onArchiveSelect
}: {
  disabledDelete?: boolean;
  onDeleteSelect?: () => void;
  onArchiveSelect?: () => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        disabled={disabledDelete}
        onSelect={() => {
          onDeleteSelect?.();
        }}
      >
        Delete
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={() => {
          onArchiveSelect?.();
        }}
      >
        Archive
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const CheckboxMenuHarness = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>Preferences</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
            Show status
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p>Checked: {String(checked)}</p>
    </div>
  );
};

describe('DropdownMenu', () => {
  it('opens and executes menu item action', async () => {
    const user = userEvent.setup();
    let executed = false;

    render(
      <DropdownMenuHarness
        onDeleteSelect={() => {
          executed = true;
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));
    expect(executed).toBe(true);
  });

  it('emits open state changes in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <DropdownMenu open={false} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>Controlled actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Controlled actions' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <DropdownMenu open onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>Controlled actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports keyboard navigation and selection', async () => {
    const user = userEvent.setup();
    const onDeleteSelect = vi.fn();
    const onArchiveSelect = vi.fn();

    render(<DropdownMenuHarness onDeleteSelect={onDeleteSelect} onArchiveSelect={onArchiveSelect} />);

    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();

    await user.keyboard('{Enter}');

    expect(onDeleteSelect).toHaveBeenCalledTimes(1);
    expect(onArchiveSelect).not.toHaveBeenCalled();
  });

  it('does not execute disabled menu item actions', async () => {
    const user = userEvent.setup();
    const onDeleteSelect = vi.fn();
    const onArchiveSelect = vi.fn();

    render(
      <DropdownMenuHarness
        disabledDelete
        onDeleteSelect={onDeleteSelect}
        onArchiveSelect={onArchiveSelect}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const deleteItem = await screen.findByRole('menuitem', { name: 'Delete' });
    expect(deleteItem).toHaveAttribute('aria-disabled', 'true');
    expect(deleteItem).toHaveAttribute('data-disabled', '');

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onDeleteSelect).not.toHaveBeenCalled();
    expect(onArchiveSelect).toHaveBeenCalledTimes(1);
  });

  it('updates checkbox item state in menu', async () => {
    const user = userEvent.setup();

    render(<CheckboxMenuHarness />);

    expect(screen.getByText('Checked: false')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Preferences' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Show status' }));
    expect(screen.getByText('Checked: true')).toBeInTheDocument();
  });
});
