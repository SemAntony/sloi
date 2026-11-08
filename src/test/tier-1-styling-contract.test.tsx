import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../shared/ui/button/button';
import { Input } from '../shared/ui/input/input';
import { DataTableV2 } from '../shared/ui/data-table-v2';
import { Checkbox } from '../shared/ui/primitives/checkbox/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '../shared/ui/primitives/dialog/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../shared/ui/primitives/dropdown-menu/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from '../shared/ui/primitives/select/select';
import { Switch, SwitchThumb } from '../shared/ui/primitives/switch/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/ui/primitives/tabs/tabs';
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '../shared/ui/primitives/toast/toast';
import { Tooltip } from '../shared/ui/tooltip/tooltip';

describe('Tier-1 styling contract', () => {
  it('keeps button root className and asChild class forwarding', () => {
    render(
      <>
        <Button className='contract-button'>Primary</Button>
        <Button asChild className='contract-button-child'>
          <a href='/contracts'>As child link</a>
        </Button>
      </>
    );

    expect(screen.getByRole('button', { name: 'Primary' })).toHaveClass('contract-button');
    expect(screen.getByRole('link', { name: 'As child link' })).toHaveClass('contract-button-child');
  });

  it('keeps input className and invalid data hook', () => {
    render(<Input aria-label='Contract input' className='contract-input' invalid />);
    const input = screen.getByRole('textbox', { name: 'Contract input' });

    expect(input).toHaveClass('contract-input');
    expect(input).toHaveAttribute('data-invalid', '');
  });

  it('keeps select trigger/content/item hooks and state attributes', async () => {
    const user = userEvent.setup();

    render(
      <Select defaultValue='apple'>
        <SelectTrigger aria-label='Contract select' className='contract-select-trigger'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='contract-select-content'>
          <SelectViewport>
            <SelectItem value='apple'>Apple</SelectItem>
            <SelectItem value='banana' disabled>
              Banana
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole('combobox', { name: 'Contract select' });
    expect(trigger).toHaveClass('contract-select-trigger');
    expect(trigger).toHaveAttribute('data-state', 'closed');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'open');

    const listbox = await screen.findByRole('listbox');
    expect(listbox).toHaveClass('contract-select-content');
    expect(listbox).toHaveAttribute('data-side');

    const disabledItem = screen.getByRole('option', { name: 'Banana' });
    expect(disabledItem).toHaveAttribute('data-disabled', '');
  });

  it('keeps dialog overlay/content class hooks and open state attributes', () => {
    render(
      <Dialog open onOpenChange={() => undefined}>
        <DialogPortal>
          <DialogOverlay className='contract-dialog-overlay' />
          <DialogContent className='contract-dialog-content'>
            <DialogTitle>Contract dialog</DialogTitle>
            <DialogDescription>Contract dialog description</DialogDescription>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog', { name: 'Contract dialog' });
    expect(dialog).toHaveClass('contract-dialog-content');
    expect(dialog).toHaveAttribute('data-state', 'open');

    const overlay = document.querySelector('.contract-dialog-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay).toHaveAttribute('data-state', 'open');
  });

  it('keeps dropdown-menu content/item hooks with menu state attributes', async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger className='contract-menu-trigger'>Menu</DropdownMenuTrigger>
        <DropdownMenuContent className='contract-menu-content'>
          <DropdownMenuItem disabled>Disabled item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole('button', { name: 'Menu' });
    expect(trigger).toHaveClass('contract-menu-trigger');
    await user.click(trigger);

    const menu = await screen.findByRole('menu');
    expect(menu).toHaveClass('contract-menu-content');
    expect(menu).toHaveAttribute('data-side');

    expect(screen.getByRole('menuitem', { name: 'Disabled item' })).toHaveAttribute('data-disabled', '');
  });

  it('keeps tabs state hooks for triggers', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue='overview' className='contract-tabs-root'>
        <TabsList aria-label='Contract tabs'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>Overview panel</TabsContent>
        <TabsContent value='settings'>Settings panel</TabsContent>
      </Tabs>
    );

    const overview = screen.getByRole('tab', { name: 'Overview' });
    const settings = screen.getByRole('tab', { name: 'Settings' });

    expect(overview).toHaveAttribute('data-state', 'active');
    expect(settings).toHaveAttribute('data-state', 'inactive');

    await user.click(settings);
    expect(settings).toHaveAttribute('data-state', 'active');
    expect(overview).toHaveAttribute('data-state', 'inactive');
  });

  it('keeps checkbox/switch state and disabled hooks', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Checkbox aria-label='Contract checkbox' disabled />
        <Switch aria-label='Contract switch'>
          <SwitchThumb />
        </Switch>
      </>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Contract checkbox' });
    expect(checkbox).toHaveAttribute('data-disabled', '');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    const control = screen.getByRole('switch', { name: 'Contract switch' });
    expect(control).toHaveAttribute('data-state', 'unchecked');
    await user.click(control);
    expect(control).toHaveAttribute('data-state', 'checked');
  });

  it('keeps tooltip content and arrow class hooks with side state', async () => {
    render(
      <Tooltip
        open
        onOpenChange={() => undefined}
        delayDuration={0}
        className='contract-tooltip-content'
        arrowClassName='contract-tooltip-arrow'
        content='Contract tooltip'
      >
        <button type='button'>Tooltip target</button>
      </Tooltip>
    );

    await screen.findByRole('tooltip');
    const tooltipContent = document.querySelector('.contract-tooltip-content');
    expect(tooltipContent).not.toBeNull();
    expect(tooltipContent).toHaveAttribute('data-side');
    expect(document.querySelector('.contract-tooltip-arrow')).not.toBeNull();
  });

  it('keeps toast root and viewport hooks with open state', () => {
    render(
      <ToastProvider>
        <Toast open onOpenChange={() => undefined} className='contract-toast-root'>
          <ToastTitle>Styled toast</ToastTitle>
          <ToastDescription>Styled description</ToastDescription>
        </Toast>
        <ToastViewport className='contract-toast-viewport' />
      </ToastProvider>
    );

    const toastRoot = screen.getByText('Styled toast').closest('[data-state]');
    expect(toastRoot).not.toBeNull();
    expect(toastRoot).toHaveClass('contract-toast-root');
    expect(toastRoot).toHaveAttribute('data-state', 'open');
    expect(document.querySelector('.contract-toast-viewport')).not.toBeNull();
  });

  it('keeps DataTableV2 root and row key hooks', () => {
    const { container } = render(
      <DataTableV2
        className='contract-datatable-root'
        data={[
          { id: 'INV-1', customer: 'Alice' },
          { id: 'INV-2', customer: 'Bob' }
        ]}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 160 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 }
        ]}
        enableColumnResize
      />
    );

    expect(container.firstElementChild).toHaveClass('contract-datatable-root');
    expect(container.querySelector('[data-row-key="INV-1"]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Resize column Customer' })).toBeInTheDocument();
  });
});
