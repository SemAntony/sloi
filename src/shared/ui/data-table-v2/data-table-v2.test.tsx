import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import {
  DataTableV2,
  type DataTableV2ColumnPinningState,
  type DataTableV2ColumnSizeState
} from './index';

type Row = {
  id: string;
  customer: string;
};

const rows: Row[] = [
  { id: 'INV-1', customer: 'Acme' },
  { id: 'INV-2', customer: 'Globex' }
];

const virtualRows: Row[] = Array.from({ length: 320 }, (_, index) => ({
  id: `INV-${1000 + index + 1}`,
  customer: `Customer ${index + 1}`
}));

const enterpriseRows: Row[] = Array.from({ length: 1200 }, (_, index) => ({
  id: `INV-${1000 + index + 1}`,
  customer: `Enterprise customer ${index + 1}`
}));

describe('DataTableV2', () => {
  it('renders with V1-compatible baseline behavior while accepting V2 pinning props', () => {
    const pinned: DataTableV2ColumnPinningState = {
      left: ['id'],
      right: []
    };

    const { container } = render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id' },
          { id: 'customer', header: 'Customer', accessor: 'customer' }
        ]}
        enableColumnPinning
        defaultPinnedColumns={pinned}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveAttribute('enableColumnPinning');
    expect(container.firstElementChild).not.toHaveAttribute('defaultPinnedColumns');
  });

  it('reorders pinned columns and applies sticky offsets for left/right pinning', () => {
    render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 140 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 180 },
          { id: 'amount', header: 'Amount', accessor: () => '$100', width: 120 }
        ]}
        enableColumnPinning
        defaultPinnedColumns={{
          left: ['customer'],
          right: ['amount']
        }}
      />
    );

    const headerOrder = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent?.replace('↕', '').trim());
    expect(headerOrder).toEqual(['Customer', 'Invoice', 'Amount']);

    expect(screen.getByRole('columnheader', { name: 'Customer' })).toHaveStyle({
      position: 'sticky',
      left: '0px'
    });
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveStyle({
      position: 'sticky',
      right: '0px'
    });
  });

  it('supports keyboard-only pinning and unpinning from pin controls', async () => {
    const user = userEvent.setup();

    render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 140 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 180 },
          { id: 'amount', header: 'Amount', accessor: () => '$100', width: 120 }
        ]}
        enableColumnPinning
      />
    );

    const getHeaderOrder = () =>
      screen.getAllByRole('columnheader').map((header) => header.textContent?.replace('↕', '').trim());

    expect(getHeaderOrder()).toEqual(['Invoice', 'Customer', 'Amount']);

    const pinColumnsButton = screen.getByRole('button', { name: 'Pin columns' });
    pinColumnsButton.focus();
    await user.keyboard('{Enter}');

    const pinCustomerLeftButton = await screen.findByRole('button', { name: 'Pin column Customer left' });
    pinCustomerLeftButton.focus();
    await user.keyboard('{Enter}');

    expect(getHeaderOrder()).toEqual(['Customer', 'Invoice', 'Amount']);

    const pinAmountRightButton = screen.getByRole('button', { name: 'Pin column Amount right' });
    pinAmountRightButton.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveStyle({
      position: 'sticky',
      right: '0px'
    });

    const unpinCustomerButton = screen.getByRole('button', { name: 'Unpin column Customer' });
    unpinCustomerButton.focus();
    await user.keyboard('{Enter}');
    const unpinAmountButton = screen.getByRole('button', { name: 'Unpin column Amount' });
    unpinAmountButton.focus();
    await user.keyboard('{Enter}');

    expect(getHeaderOrder()).toEqual(['Invoice', 'Customer', 'Amount']);
  });

  it('preserves mixed pin order while sorting pinned column', async () => {
    const user = userEvent.setup();

    render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 140, sortable: true },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 180, sortable: true },
          { id: 'amount', header: 'Amount', accessor: () => '$100', width: 120, sortable: true }
        ]}
        enableColumnPinning
        defaultPinnedColumns={{
          left: ['customer'],
          right: ['amount']
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Amount' }));

    const headerOrder = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent?.replace('↕', '').replace('▲', '').replace('▼', '').trim());
    expect(headerOrder).toEqual(['Customer', 'Invoice', 'Amount']);
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveAttribute('aria-sort', 'ascending');
  });

  it('keeps pin preference when pinned column is hidden and shown again', async () => {
    const user = userEvent.setup();

    render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 140 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 180 },
          { id: 'amount', header: 'Amount', accessor: () => '$100', width: 120 }
        ]}
        enableColumnPinning
        defaultPinnedColumns={{
          left: ['id'],
          right: []
        }}
        columnVisibility={{
          defaultVisibleColumnIds: ['id', 'customer', 'amount']
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    const invoiceToggle = await screen.findByRole('checkbox', { name: 'Toggle column Invoice' });
    await user.click(invoiceToggle);
    expect(screen.queryByRole('columnheader', { name: 'Invoice' })).not.toBeInTheDocument();

    await user.click(invoiceToggle);

    const headers = screen.getAllByRole('columnheader').map((header) => header.textContent?.trim());
    expect(headers[0]).toContain('Invoice');
    expect(screen.getByRole('columnheader', { name: 'Invoice' })).toHaveStyle({
      position: 'sticky',
      left: '0px'
    });
  });

  it('keeps predictable tab order in pinning controls', async () => {
    const user = userEvent.setup();

    render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 140 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 180 },
          { id: 'amount', header: 'Amount', accessor: () => '$100', width: 120 }
        ]}
        enableColumnPinning
        defaultPinnedColumns={{
          left: ['id'],
          right: []
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Pin columns' }));
    const popoverAction = await screen.findByRole('button', { name: 'Pin column Invoice right' });
    popoverAction.focus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Unpin column Invoice' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Pin column Customer left' })).toHaveFocus();

    const controlsByRow = screen.getAllByRole('button', { name: /column .* (left|right)|Unpin column /i });
    expect(controlsByRow.length).toBeGreaterThan(0);
  });

  it('supports controlled pinning updates via onPinnedColumnsChange', async () => {
    const user = userEvent.setup();

    const ControlledPinningTable = () => {
      const [pinnedColumns, setPinnedColumns] = useState<DataTableV2ColumnPinningState>({
        left: ['id'],
        right: []
      });

      return (
        <DataTableV2
          data={rows}
          rowKey='id'
          columns={[
            { id: 'id', header: 'Invoice', accessor: 'id', width: 140 },
            { id: 'customer', header: 'Customer', accessor: 'customer', width: 180 },
            { id: 'amount', header: 'Amount', accessor: () => '$100', width: 120 }
          ]}
          enableColumnPinning
          pinnedColumns={pinnedColumns}
          onPinnedColumnsChange={setPinnedColumns}
        />
      );
    };

    render(<ControlledPinningTable />);

    await user.click(screen.getByRole('button', { name: 'Pin columns' }));
    await user.click(await screen.findByRole('button', { name: 'Pin column Customer left' }));

    const headerOrder = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent?.replace('↕', '').replace('▲', '').replace('▼', '').trim());
    expect(headerOrder).toEqual(['Invoice', 'Customer', 'Amount']);
    expect(screen.getByRole('button', { name: 'Pin column Customer left' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Unpin column Customer' })).toBeEnabled();
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toHaveStyle({
      position: 'sticky',
      left: '140px'
    });
  });

  it('ignores unknown pinned column ids and keeps valid pinned columns', () => {
    render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 140 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 180 },
          { id: 'amount', header: 'Amount', accessor: () => '$100', width: 120 }
        ]}
        enableColumnPinning
        defaultPinnedColumns={{
          left: ['unknown-column', 'id'],
          right: ['unknown-right']
        }}
      />
    );

    const headerOrder = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent?.replace('↕', '').replace('▲', '').replace('▼', '').trim());
    expect(headerOrder[0]).toBe('Invoice');
  });

  it('applies default column size and supports keyboard resize with clamping', async () => {
    const user = userEvent.setup();

    render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 160 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 }
        ]}
        enableColumnResize
        defaultColumnSizes={{ customer: 240 }}
        minColumnWidth={140}
        maxColumnWidth={280}
      />
    );

    const customerHeader = screen.getByRole('columnheader', { name: 'Customer' });
    expect(customerHeader).toHaveStyle({ width: '240px' });

    const resizeHandle = screen.getByRole('button', { name: 'Resize column Customer' });
    resizeHandle.focus();
    await user.keyboard('{End}');
    expect(customerHeader).toHaveStyle({ width: '280px' });

    await user.keyboard('{Home}');
    expect(customerHeader).toHaveStyle({ width: '140px' });
  });

  it('supports pointer resize interactions', () => {
    render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 160 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 }
        ]}
        enableColumnResize
      />
    );

    const customerHeader = screen.getByRole('columnheader', { name: 'Customer' });
    const resizeHandle = screen.getByRole('button', { name: 'Resize column Customer' });
    expect(customerHeader).toHaveStyle({ width: '220px' });

    fireEvent.pointerDown(resizeHandle, { button: 0, clientX: 200 });
    fireEvent.pointerMove(window, { clientX: 260 });
    fireEvent.pointerUp(window);

    expect(customerHeader).toHaveStyle({ width: '280px' });
  });

  it('supports controlled resize state via onColumnSizesChange', async () => {
    const user = userEvent.setup();

    const ControlledResizeTable = () => {
      const [columnSizes, setColumnSizes] = useState<DataTableV2ColumnSizeState>({
        customer: 220
      });

      return (
        <DataTableV2
          data={rows}
          rowKey='id'
          columns={[
            { id: 'id', header: 'Invoice', accessor: 'id', width: 160 },
            { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 }
          ]}
          enableColumnResize
          columnSizes={columnSizes}
          onColumnSizesChange={setColumnSizes}
        />
      );
    };

    render(<ControlledResizeTable />);

    const customerHeader = screen.getByRole('columnheader', { name: 'Customer' });
    const resizeHandle = screen.getByRole('button', { name: 'Resize column Customer' });

    resizeHandle.focus();
    await user.keyboard('{ArrowRight}');
    expect(customerHeader).toHaveStyle({ width: '232px' });
  });

  it('keeps horizontal overflow contract on constrained viewport with resize enabled', () => {
    render(
      <div style={{ width: '320px' }}>
        <DataTableV2
          data={rows}
          rowKey='id'
          columns={[
            { id: 'id', header: 'Invoice', accessor: 'id', width: 160 },
            { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 },
            { id: 'amount', header: 'Amount', accessor: () => '$100', width: 140 }
          ]}
          enableColumnResize
          defaultColumnSizes={{
            id: 180,
            customer: 240,
            amount: 160
          }}
        />
      </div>
    );

    const table = screen.getByRole('table');
    const tableContainer = table.parentElement as HTMLElement;
    expect(tableContainer).toHaveStyle({ overflowX: 'auto' });

    expect(screen.getByRole('columnheader', { name: 'Invoice' })).toHaveStyle({ width: '180px' });
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toHaveStyle({ width: '240px' });
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveStyle({ width: '160px' });
  });

  it('keeps pinning offsets stable after resize in constrained viewport', () => {
    render(
      <div style={{ width: '360px' }}>
        <DataTableV2
          data={rows}
          rowKey='id'
          columns={[
            { id: 'id', header: 'Invoice', accessor: 'id', width: 160 },
            { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 },
            { id: 'amount', header: 'Amount', accessor: () => '$100', width: 140 }
          ]}
          enableColumnResize
          enableColumnPinning
          defaultPinnedColumns={{
            left: ['id'],
            right: ['amount']
          }}
        />
      </div>
    );

    const invoiceHeader = screen.getByRole('columnheader', { name: 'Invoice' });
    const amountHeader = screen.getByRole('columnheader', { name: 'Amount' });
    const customerHeader = screen.getByRole('columnheader', { name: 'Customer' });
    const resizeHandle = screen.getByRole('button', { name: 'Resize column Customer' });

    fireEvent.pointerDown(resizeHandle, { button: 0, clientX: 200 });
    fireEvent.pointerMove(window, { clientX: 260 });
    fireEvent.pointerUp(window);

    expect(customerHeader).toHaveStyle({ width: '280px' });
    expect(invoiceHeader).toHaveStyle({
      position: 'sticky',
      left: '0px'
    });
    expect(amountHeader).toHaveStyle({
      position: 'sticky',
      right: '0px'
    });
  });

  it('keeps combined pinning + resize + virtualization within bounded render window', () => {
    render(
      <div style={{ width: '360px' }}>
        <DataTableV2
          data={enterpriseRows}
          rowKey='id'
          columns={[
            { id: 'id', header: 'Invoice', accessor: 'id', width: 180 },
            { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 },
            { id: 'amount', header: 'Amount', accessor: () => '$100', width: 160 }
          ]}
          showPagination={false}
          enableColumnPinning
          defaultPinnedColumns={{
            left: ['id'],
            right: ['amount']
          }}
          enableColumnResize
          defaultColumnSizes={{
            customer: 220
          }}
          enableVirtualization
          rowHeight={44}
          overscan={2}
        />
      </div>
    );

    const viewport = screen.getByLabelText('DataTable virtualized viewport');
    const invoiceHeader = screen.getByRole('columnheader', { name: 'Invoice' });
    const amountHeader = screen.getByRole('columnheader', { name: 'Amount' });
    const customerHeader = screen.getByRole('columnheader', { name: 'Customer' });
    const resizeHandle = screen.getByRole('button', { name: 'Resize column Customer' });

    expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(40);
    expect(invoiceHeader).toHaveStyle({
      position: 'sticky',
      left: '0px'
    });
    expect(amountHeader).toHaveStyle({
      position: 'sticky',
      right: '0px'
    });

    fireEvent.pointerDown(resizeHandle, { button: 0, clientX: 200 });
    fireEvent.pointerMove(window, { clientX: 260 });
    fireEvent.pointerUp(window);
    expect(customerHeader).toHaveStyle({ width: '280px' });

    fireEvent.scroll(viewport, { target: { scrollTop: 44 * 400 } });
    expect(screen.getByText('INV-1401')).toBeInTheDocument();
    expect(screen.queryByText('INV-1001')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(40);
  });

  it('virtualizes row rendering with overscan window on large datasets', () => {
    render(
      <DataTableV2
        data={virtualRows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 180 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 }
        ]}
        showPagination={false}
        enableVirtualization
        rowHeight={40}
        overscan={2}
      />
    );

    const viewport = screen.getByLabelText('DataTable virtualized viewport');
    expect(screen.getByText('INV-1001')).toBeInTheDocument();
    expect(screen.queryByText('INV-1200')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBeLessThan(virtualRows.length);

    fireEvent.scroll(viewport, { target: { scrollTop: 40 * 180 } });

    expect(screen.getByText('INV-1181')).toBeInTheDocument();
    expect(screen.queryByText('INV-1001')).not.toBeInTheDocument();
  });

  it('preserves focused row in virtualization window after scroll updates', () => {
    render(
      <DataTableV2
        data={virtualRows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 180 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 }
        ]}
        showPagination={false}
        enableVirtualization
        rowHeight={40}
        overscan={2}
        onRowClick={() => {}}
      />
    );

    const viewport = screen.getByLabelText('DataTable virtualized viewport');
    fireEvent.scroll(viewport, { target: { scrollTop: 40 * 62 } });

    const targetCell = screen.getByText('INV-1065');
    const targetRow = targetCell.closest('tr') as HTMLElement | null;
    if (!targetRow) {
      throw new Error('Expected row for INV-1065.');
    }

    targetRow.focus();
    expect(document.activeElement).toBe(targetRow);

    fireEvent.scroll(viewport, { target: { scrollTop: 40 * 64 } });

    const rowAfterScroll = screen.getByText('INV-1065').closest('tr') as HTMLElement | null;
    if (!rowAfterScroll) {
      throw new Error('Expected focused row to remain rendered after scroll.');
    }

    expect(document.activeElement).toBe(rowAfterScroll);
  });

  it('keeps virtualization compatible with selection, sort and pagination', async () => {
    const user = userEvent.setup();

    render(
      <DataTableV2
        data={virtualRows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', sortable: true, width: 180 },
          { id: 'customer', header: 'Customer', accessor: 'customer', sortable: true, width: 220 }
        ]}
        rowSelection={{}}
        enableVirtualization
        defaultPageSize={20}
        pageSizeOptions={[20]}
        showPageSizeSelector={false}
      />
    );

    const customerSortButton = screen.getByRole('button', { name: 'Customer' });
    await user.click(customerSortButton);
    await user.click(customerSortButton);
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toHaveAttribute('aria-sort', 'descending');

    await user.click(screen.getByRole('checkbox', { name: 'Select row INV-1320' }));
    expect(screen.getByRole('checkbox', { name: 'Select row INV-1320' })).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.queryByRole('checkbox', { name: 'Select row INV-1320' })).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select row INV-1300' })).toBeInTheDocument();

    const viewport = screen.getByLabelText('DataTable virtualized viewport');
    fireEvent.scroll(viewport, { target: { scrollTop: 44 * 10 } });
    expect(screen.getByText('INV-1290')).toBeInTheDocument();
  });
});
