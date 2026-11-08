import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './data-table';

type Row = {
  id: string;
  customer: string;
  status: 'Paid' | 'Pending';
  amount: number;
};

const rows: Row[] = [
  { id: 'INV-1', customer: 'Acme', status: 'Paid', amount: 100 },
  { id: 'INV-2', customer: 'Globex', status: 'Pending', amount: 200 }
];

const extendedRows: Row[] = [
  { id: 'INV-1', customer: 'Acme', status: 'Paid', amount: 100 },
  { id: 'INV-2', customer: 'Globex', status: 'Pending', amount: 200 },
  { id: 'INV-3', customer: 'Initech', status: 'Paid', amount: 300 },
  { id: 'INV-4', customer: 'Umbrella', status: 'Pending', amount: 400 },
  { id: 'INV-5', customer: 'Stark', status: 'Paid', amount: 500 },
  { id: 'INV-6', customer: 'Wayne', status: 'Pending', amount: 600 }
];

const columns: DataTableColumn<Row>[] = [
  { id: 'id', header: 'Invoice', accessor: 'id', sortable: true },
  { id: 'customer', header: 'Customer', accessor: 'customer', sortable: true },
  { id: 'status', header: 'Status', accessor: 'status', sortable: true },
  { id: 'amount', header: 'Amount', accessor: 'amount', sortable: true }
];

describe('DataTable', () => {
  it('toggles column visibility from checklist popover', async () => {
    const user = userEvent.setup();

    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        columnVisibility={{
          defaultVisibleColumnIds: ['id', 'customer', 'status', 'amount'],
          nonHideableColumnIds: ['id']
        }}
      />
    );

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    await user.click(screen.getByRole('checkbox', { name: 'Toggle column Status' }));

    expect(within(table).queryByRole('columnheader', { name: 'Status' })).not.toBeInTheDocument();
  });

  it('restores persisted visibility state from localStorage', async () => {
    const user = userEvent.setup();
    const key = 'sloi-ui:test:table-persist';
    window.localStorage.removeItem(key);

    const firstRender = render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        persistStateKey={key}
        columnVisibility={{
          defaultVisibleColumnIds: ['id', 'customer', 'status', 'amount']
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    await user.click(screen.getByRole('checkbox', { name: 'Toggle column Status' }));

    await waitFor(() => {
      const state = window.localStorage.getItem(key);
      expect(state).toBeTruthy();
      const parsed = JSON.parse(state ?? '{}') as { visibleColumnIds?: string[] };
      expect(parsed.visibleColumnIds).not.toContain('status');
    });

    firstRender.unmount();

    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        persistStateKey={key}
        columnVisibility={{
          defaultVisibleColumnIds: ['id', 'customer', 'status', 'amount']
        }}
      />
    );

    const table = screen.getByRole('table');
    expect(within(table).queryByRole('columnheader', { name: 'Status' })).not.toBeInTheDocument();
  });

  it('supports row selection with bulk actions', async () => {
    const user = userEvent.setup();

    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        rowSelection={{
          renderBulkActions: () => <button type='button'>Bulk action</button>
        }}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select row INV-1' }));

    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bulk action' })).toBeInTheDocument();
  });

  it('keeps non-hideable and last-visible columns non-toggleable', async () => {
    const user = userEvent.setup();

    const firstRender = render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        columnVisibility={{
          defaultVisibleColumnIds: ['id', 'customer'],
          nonHideableColumnIds: ['id']
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Columns' }));

    expect(screen.getByRole('checkbox', { name: 'Toggle column Invoice' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Toggle column Customer' })).toBeEnabled();

    firstRender.unmount();

    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        columnVisibility={{
          defaultVisibleColumnIds: ['customer']
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    expect(screen.getByRole('checkbox', { name: 'Toggle column Customer' })).toBeDisabled();
  });

  it('supports row click via Enter and Space keyboard keys', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        onRowClick={onRowClick}
      />
    );

    const tableRows = within(screen.getByRole('table')).getAllByRole('row');
    const firstDataRow = tableRows[1];
    if (!firstDataRow) {
      throw new Error('Expected first data row to exist.');
    }

    firstDataRow.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onRowClick).toHaveBeenCalledTimes(2);
    expect(onRowClick).toHaveBeenNthCalledWith(1, rows[0], 0);
    expect(onRowClick).toHaveBeenNthCalledWith(2, rows[0], 0);
  });

  it('cycles sort state in both client and server modes with same callback sequence', async () => {
    const user = userEvent.setup();

    for (const mode of ['client', 'server'] as const) {
      const onSortChange = vi.fn();
      const view =
        mode === 'server'
          ? render(
              <DataTable
                processingMode='server'
                totalItems={rows.length}
                data={rows}
                columns={columns}
                rowKey='id'
                onSortChange={onSortChange}
              />
            )
          : render(
              <DataTable
                data={rows}
                columns={columns}
                rowKey='id'
                onSortChange={onSortChange}
              />
            );

      const sortButton = screen.getByRole('button', { name: 'Amount' });

      await user.click(sortButton);
      await user.click(sortButton);
      await user.click(sortButton);

      expect(onSortChange).toHaveBeenCalledTimes(3);
      expect(onSortChange).toHaveBeenNthCalledWith(1, { columnId: 'amount', direction: 'asc' });
      expect(onSortChange).toHaveBeenNthCalledWith(2, { columnId: 'amount', direction: 'desc' });
      expect(onSortChange).toHaveBeenNthCalledWith(3, undefined);

      view.unmount();
    }
  });

  it('restores persisted sort/page/pageSize/column visibility state', async () => {
    const user = userEvent.setup();
    const key = 'sloi-ui:test:table-persist-full';
    window.localStorage.removeItem(key);

    const firstRender = render(
      <DataTable
        data={extendedRows}
        columns={columns}
        rowKey='id'
        persistStateKey={key}
        defaultPageSize={1}
        pageSizeOptions={[1, 2, 3]}
        columnVisibility={{
          defaultVisibleColumnIds: ['id', 'customer', 'status', 'amount']
        }}
      />
    );

    const amountSortButton = screen.getByRole('button', { name: 'Amount' });
    await user.click(amountSortButton);
    await user.click(amountSortButton);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.selectOptions(screen.getByRole('combobox'), '2');

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    await user.click(screen.getByRole('checkbox', { name: 'Toggle column Status' }));

    await waitFor(() => {
      const state = window.localStorage.getItem(key);
      expect(state).toBeTruthy();
      const parsed = JSON.parse(state ?? '{}') as {
        sort?: { columnId: string; direction: 'asc' | 'desc' };
        page?: number;
        pageSize?: number;
        visibleColumnIds?: string[];
      };

      expect(parsed.sort).toEqual({ columnId: 'amount', direction: 'desc' });
      expect(parsed.page).toBe(2);
      expect(parsed.pageSize).toBe(2);
      expect(parsed.visibleColumnIds).not.toContain('status');
    });

    firstRender.unmount();

    render(
      <DataTable
        data={extendedRows}
        columns={columns}
        rowKey='id'
        persistStateKey={key}
        defaultPageSize={1}
        pageSizeOptions={[1, 2, 3]}
        columnVisibility={{
          defaultVisibleColumnIds: ['id', 'customer', 'status', 'amount']
        }}
      />
    );

    const table = screen.getByRole('table');
    expect(within(table).queryByRole('columnheader', { name: 'Status' })).not.toBeInTheDocument();
    expect(screen.getByText('Showing 3-4 of 6')).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Amount' })).toHaveAttribute('aria-sort', 'descending');
  });

  it('ignores malformed persisted state and falls back to runtime defaults', () => {
    const key = 'sloi-ui:test:table-persist-malformed';
    window.localStorage.setItem(key, '{ not-valid-json');

    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        persistStateKey={key}
        defaultPageSize={1}
        columnVisibility={{
          defaultVisibleColumnIds: ['id', 'customer', 'status', 'amount']
        }}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Showing 1-1 of 2')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
  });
});
