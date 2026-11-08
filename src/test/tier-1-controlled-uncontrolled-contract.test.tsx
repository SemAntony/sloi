import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../shared/ui/input/input';
import { DataTableV2 } from '../shared/ui/data-table-v2';
import { Checkbox } from '../shared/ui/primitives/checkbox/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from '../shared/ui/primitives/dialog/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../shared/ui/primitives/dropdown-menu/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '../shared/ui/primitives/radio-group/radio-group';
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
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '../shared/ui/primitives/toast/toast';
import { Tooltip } from '../shared/ui/tooltip/tooltip';

describe('Tier-1 controlled/uncontrolled contract', () => {
  it('keeps native input value/defaultValue/onChange contract', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <>
        <Input aria-label='Uncontrolled name' defaultValue='Alice' />
        <Input aria-label='Controlled name' value='Bob' onChange={onChange} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Uncontrolled name' })).toHaveValue('Alice');
    await user.type(screen.getByRole('textbox', { name: 'Controlled name' }), 'X');
    expect(onChange).toHaveBeenCalled();
  });

  it('keeps select value/defaultValue/onValueChange contract', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <>
        <Select defaultValue='apple'>
          <SelectTrigger aria-label='Default food'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectViewport>
              <SelectItem value='apple'>Apple</SelectItem>
              <SelectItem value='banana'>Banana</SelectItem>
            </SelectViewport>
          </SelectContent>
        </Select>
        <Select value='apple' onValueChange={onValueChange}>
          <SelectTrigger aria-label='Controlled food'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectViewport>
              <SelectItem value='apple'>Apple</SelectItem>
              <SelectItem value='banana'>Banana</SelectItem>
            </SelectViewport>
          </SelectContent>
        </Select>
      </>
    );

    expect(screen.getByRole('combobox', { name: 'Default food' })).toHaveTextContent('Apple');
    await user.click(screen.getByRole('combobox', { name: 'Controlled food' }));
    await user.click(await screen.findByRole('option', { name: 'Banana' }));
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('keeps tabs value/defaultValue/onValueChange contract', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <>
        <Tabs defaultValue='overview'>
          <TabsList aria-label='Default tabs'>
            <TabsTrigger value='overview'>Default overview</TabsTrigger>
            <TabsTrigger value='settings'>Default settings</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>Default overview panel</TabsContent>
          <TabsContent value='settings'>Default settings panel</TabsContent>
        </Tabs>
        <Tabs value='overview' onValueChange={onValueChange}>
          <TabsList aria-label='Controlled tabs'>
            <TabsTrigger value='overview'>Controlled overview</TabsTrigger>
            <TabsTrigger value='settings'>Controlled settings</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>Controlled overview panel</TabsContent>
          <TabsContent value='settings'>Controlled settings panel</TabsContent>
        </Tabs>
      </>
    );

    expect(screen.getByText('Default overview panel')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Controlled settings' }));
    expect(onValueChange).toHaveBeenCalledWith('settings');
  });

  it('keeps checkbox checked/defaultChecked/onCheckedChange contract', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <>
        <Checkbox aria-label='Default checkbox' defaultChecked />
        <Checkbox aria-label='Controlled checkbox' checked={false} onCheckedChange={onCheckedChange} />
      </>
    );

    expect(screen.getByRole('checkbox', { name: 'Default checkbox' })).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByRole('checkbox', { name: 'Controlled checkbox' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('keeps radio-group value/defaultValue/onValueChange contract', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <>
        <RadioGroup defaultValue='daily' aria-label='Default notifications'>
          <RadioGroupItem value='daily' aria-label='Default daily' />
          <RadioGroupItem value='weekly' aria-label='Default weekly' />
        </RadioGroup>
        <RadioGroup value='daily' onValueChange={onValueChange} aria-label='Controlled notifications'>
          <RadioGroupItem value='daily' aria-label='Controlled daily' />
          <RadioGroupItem value='weekly' aria-label='Controlled weekly' />
        </RadioGroup>
      </>
    );

    expect(screen.getByRole('radio', { name: 'Default daily' })).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByRole('radio', { name: 'Controlled weekly' }));
    expect(onValueChange).toHaveBeenCalledWith('weekly');
  });

  it('keeps switch checked/defaultChecked/onCheckedChange contract', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <>
        <Switch aria-label='Default switch' defaultChecked>
          <SwitchThumb />
        </Switch>
        <Switch aria-label='Controlled switch' checked={false} onCheckedChange={onCheckedChange}>
          <SwitchThumb />
        </Switch>
      </>
    );

    expect(screen.getByRole('switch', { name: 'Default switch' })).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByRole('switch', { name: 'Controlled switch' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('keeps dialog defaultOpen contract', () => {
    render(
      <Dialog defaultOpen>
        <DialogPortal>
          <DialogContent>
            <DialogTitle>Default dialog</DialogTitle>
            <DialogDescription>Default description</DialogDescription>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    expect(screen.getByRole('dialog', { name: 'Default dialog' })).toBeInTheDocument();
  });

  it('keeps dialog open/onOpenChange controlled contract', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogTrigger>Open controlled dialog</DialogTrigger>
        <DialogPortal>
          <DialogContent>
            <DialogTitle>Controlled dialog</DialogTitle>
            <DialogDescription>Controlled description</DialogDescription>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: 'Open controlled dialog' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('keeps dropdown-menu defaultOpen contract', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Default actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Default item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByRole('menuitem', { name: 'Default item' })).toBeInTheDocument();
  });

  it('keeps dropdown-menu open/onOpenChange controlled contract', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <DropdownMenu open={false} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>Controlled actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Controlled item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Controlled actions' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('keeps tooltip open/defaultOpen/onOpenChange contract', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <>
        <Tooltip defaultOpen delayDuration={0} content='Default tooltip'>
          <button type='button'>Default target</button>
        </Tooltip>
        <Tooltip open={false} onOpenChange={onOpenChange} delayDuration={0} content='Controlled tooltip'>
          <button type='button'>Controlled target</button>
        </Tooltip>
      </>
    );

    expect(await screen.findByRole('tooltip', { name: 'Default tooltip' })).toBeInTheDocument();
    await user.hover(screen.getByRole('button', { name: 'Controlled target' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('keeps toast open/defaultOpen/onOpenChange contract', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ToastProvider>
        <Toast defaultOpen>
          <ToastTitle>Default toast</ToastTitle>
          <ToastDescription>Default description</ToastDescription>
        </Toast>
        <Toast open onOpenChange={onOpenChange}>
          <ToastTitle>Controlled toast</ToastTitle>
          <ToastDescription>Controlled description</ToastDescription>
          <ToastClose aria-label='Close controlled toast'>Close</ToastClose>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('Default toast')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close controlled toast' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps DataTableV2 controlled pinning/resize state channels stable', async () => {
    const user = userEvent.setup();
    const onPinnedColumnsChange = vi.fn();
    const onColumnSizesChange = vi.fn();

    render(
      <DataTableV2
        data={[
          { id: 'INV-1', customer: 'Alice' },
          { id: 'INV-2', customer: 'Bob' }
        ]}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 160 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 }
        ]}
        enableColumnPinning
        pinnedColumns={{ left: ['id'], right: [] }}
        onPinnedColumnsChange={onPinnedColumnsChange}
        enableColumnResize
        columnSizes={{ customer: 220 }}
        onColumnSizesChange={onColumnSizesChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Pin columns' }));
    await user.click(await screen.findByRole('button', { name: 'Pin column Customer left' }));

    expect(
      onPinnedColumnsChange.mock.calls.some(([state]) =>
        Array.isArray(state.left) && state.left.includes('customer')
      )
    ).toBe(true);

    const resizeHandle = screen.getByRole('button', { name: 'Resize column Customer' });
    resizeHandle.focus();
    await user.keyboard('{ArrowRight}');

    expect(
      onColumnSizesChange.mock.calls.some(([state]) =>
        typeof state.customer === 'number' && state.customer > 220
      )
    ).toBe(true);
  });
});
