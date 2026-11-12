import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { DataTable, type DataTableColumn, type DataTableSortState } from './data-table';
import { Button } from '../button';
import storyStyles from '../input/input.stories.module.scss';

type InvoiceRow = {
  id: string;
  customer: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  amount: number;
  issuedAt: string;
};

const rows: InvoiceRow[] = [
  { id: 'INV-1024', customer: 'Acme Co.', status: 'Paid', amount: 1240, issuedAt: '2026-01-14' },
  { id: 'INV-1025', customer: 'Northwind', status: 'Pending', amount: 860, issuedAt: '2026-02-06' },
  { id: 'INV-1026', customer: 'Globex', status: 'Overdue', amount: 2140, issuedAt: '2025-12-22' },
  { id: 'INV-1027', customer: 'Initech', status: 'Paid', amount: 430, issuedAt: '2026-03-01' },
  { id: 'INV-1028', customer: 'Umbrella', status: 'Pending', amount: 1740, issuedAt: '2026-02-14' },
  { id: 'INV-1029', customer: 'Stark', status: 'Paid', amount: 980, issuedAt: '2026-03-15' },
  { id: 'INV-1030', customer: 'Wayne', status: 'Overdue', amount: 3320, issuedAt: '2025-11-18' },
  { id: 'INV-1031', customer: 'Wonka', status: 'Pending', amount: 260, issuedAt: '2026-03-18' }
];

const columns: DataTableColumn<InvoiceRow>[] = [
  {
    id: 'id',
    header: 'Invoice',
    accessor: 'id',
    sortable: true
  },
  {
    id: 'customer',
    header: 'Customer',
    accessor: 'customer',
    sortable: true
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true
  },
  {
    id: 'issuedAt',
    header: 'Issued',
    cell: (row) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(row.issuedAt)),
    sortable: true,
    sortAccessor: (row) => new Date(row.issuedAt)
  },
  {
    id: 'amount',
    header: 'Amount',
    align: 'right',
    cell: (row) => `$${row.amount.toLocaleString('en-US')}`,
    sortable: true,
    sortAccessor: 'amount'
  }
];

const applyClientSort = (inputRows: InvoiceRow[], sort: DataTableSortState | undefined) => {
  if (!sort) {
    return inputRows;
  }

  const direction = sort.direction === 'asc' ? 1 : -1;

  const getValue = (row: InvoiceRow) => {
    if (sort.columnId === 'amount') {
      return row.amount;
    }
    if (sort.columnId === 'issuedAt') {
      return new Date(row.issuedAt).getTime();
    }
    return String(row[sort.columnId as keyof InvoiceRow]).toLowerCase();
  };

  return [...inputRows]
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const leftValue = getValue(left.row);
      const rightValue = getValue(right.row);

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        const diff = leftValue - rightValue;
        return diff === 0 ? left.index - right.index : diff * direction;
      }

      const diff = String(leftValue).localeCompare(String(rightValue), undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      return diff === 0 ? left.index - right.index : diff * direction;
    })
    .map((item) => item.row);
};

const persistedStoryStorageKey = 'sloi-ui:storybook:data-table-persisted-v1';

const meta = {
  title: 'UI/DataTable',
  component: DataTable as unknown as ComponentType
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DataTable data={rows} columns={columns} rowKey='id' defaultSort={{ columnId: 'issuedAt', direction: 'desc' }} />
  )
};

export const States: Story = {
  render: () => (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <DataTable data={rows} columns={columns} rowKey='id' loading paginationLabel='Loading table pagination' />
      <DataTable data={[]} columns={columns} rowKey='id' emptyMessage='No invoices for this period.' paginationLabel='Empty table pagination' />
      <DataTable data={rows} columns={columns} rowKey='id' striped density='compact' paginationLabel='Compact table pagination' />
    </div>
  )
};

const ClientControlledPreview = () => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<DataTableSortState | undefined>({
    columnId: 'amount',
    direction: 'desc'
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((row) => {
      const text = `${row.id} ${row.customer} ${row.status}`.toLowerCase();
      return text.includes(normalizedQuery);
    });
  }, [query]);

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <input
        type='search'
        placeholder='Filter rows'
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(1);
        }}
      />
      <DataTable
        data={filteredRows}
        columns={columns}
        rowKey='id'
        sort={sort}
        onSortChange={setSort}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(next) => {
          setPageSize(next);
          setPage(1);
        }}
        pageSizeOptions={[5, 10]}
      />
      <p className={storyStyles.meta}>
        Controlled state: {filteredRows.length} rows, page {page}, page size {pageSize}
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ClientControlledPreview />,
  play: async ({ canvas, step }) => {
    const filterInput = canvas.getByPlaceholderText('Filter rows');

    await step('Filter table rows', async () => {
      await userEvent.clear(filterInput);
      await userEvent.type(filterInput, 'Acme');
    });

    await step('Verify filtered output', async () => {
      await expect(await canvas.findByText('Acme Co.')).toBeInTheDocument();
      await expect(canvas.queryByText('Northwind')).not.toBeInTheDocument();
    });
  }
};

const RowSelectionPreview = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        defaultSort={{ columnId: 'issuedAt', direction: 'desc' }}
        pageSize={5}
        onPageChange={() => setLastAction(null)}
        rowSelection={{
          selectedKeys,
          onSelectedKeysChange: (nextKeys) => {
            setSelectedKeys(nextKeys);
            setLastAction(null);
          },
          renderBulkActions: ({ selectedRows, clearSelection }) => (
            <>
              <Button
                size='sm'
                variant='secondary'
                onClick={() => {
                  setLastAction(`Archived ${selectedRows.length} invoice(s).`);
                  clearSelection();
                }}
              >
                Archive
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  setLastAction(`Marked ${selectedRows.length} invoice(s) as paid.`);
                  clearSelection();
                }}
              >
                Mark as paid
              </Button>
            </>
          )
        }}
      />
      <p className={storyStyles.meta}>
        Selected: {selectedKeys.length}
        {lastAction ? ` · ${lastAction}` : ''}
      </p>
    </div>
  );
};

export const RowSelection: Story = {
  render: () => <RowSelectionPreview />,
  play: async ({ canvas, step }) => {
    await step('Select first row', async () => {
      const rowCheckboxes = await canvas.findAllByRole('checkbox', { name: /Select row /i });
      const firstRowCheckbox = rowCheckboxes[0];
      if (!firstRowCheckbox) {
        throw new Error('Expected at least one row selection checkbox.');
      }
      await userEvent.click(firstRowCheckbox);
    });

    await step('Verify bulk state', async () => {
      await expect(canvas.getByText('Selected: 1')).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Archive' })).toBeInTheDocument();
    });
  }
};

const ServerControlledPreview = () => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<DataTableSortState | undefined>({
    columnId: 'issuedAt',
    direction: 'desc'
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [loading, setLoading] = useState(false);
  const [serverRows, setServerRows] = useState<InvoiceRow[]>([]);
  const [totalItems, setTotalItems] = useState(rows.length);

  useEffect(() => {
    // Story имитирует серверный запрос: «loading» включается на время фейковой задержки.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();
      const filtered = normalizedQuery
        ? rows.filter((row) =>
            `${row.id} ${row.customer} ${row.status}`.toLowerCase().includes(normalizedQuery)
          )
        : rows;

      const sorted = applyClientSort(filtered, sort);
      const nextTotalItems = sorted.length;
      const totalPages = Math.max(1, Math.ceil(nextTotalItems / pageSize));
      const safePage = Math.min(Math.max(1, page), totalPages);
      const start = (safePage - 1) * pageSize;
      const pageSlice = sorted.slice(start, start + pageSize);

      if (safePage !== page) {
        setPage(safePage);
      }

      setTotalItems(nextTotalItems);
      setServerRows(pageSlice);
      setLoading(false);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [page, pageSize, query, sort]);

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <input
        type='search'
        placeholder='Remote query'
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(1);
        }}
      />
      <DataTable
        processingMode='server'
        data={serverRows}
        totalItems={totalItems}
        columns={columns}
        rowKey='id'
        loading={loading}
        sort={sort}
        onSortChange={(nextSort) => {
          setSort(nextSort);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
        }}
        pageSizeOptions={[3, 5]}
      />
      <p className={storyStyles.meta}>
        Server mode: {totalItems} rows total, showing {serverRows.length} on page {page}
      </p>
    </div>
  );
};

export const ServerControlled: Story = {
  render: () => <ServerControlledPreview />
};

const ColumnVisibilityPreview = () => {
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(['id', 'customer', 'status', 'amount']);

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <DataTable
        data={rows}
        columns={columns}
        rowKey='id'
        defaultSort={{ columnId: 'issuedAt', direction: 'desc' }}
        columnVisibility={{
          visibleColumnIds,
          onVisibleColumnIdsChange: setVisibleColumnIds,
          nonHideableColumnIds: ['id']
        }}
      />
      <p className={storyStyles.meta}>Visible columns: {visibleColumnIds.join(', ')}</p>
    </div>
  );
};

export const ColumnVisibility: Story = {
  render: () => <ColumnVisibilityPreview />,
  play: async ({ canvas, step }) => {
    await step('Hide status column', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
      await userEvent.click(await screen.findByRole('checkbox', { name: 'Toggle column Status' }));
    });

    await step('Verify visible columns summary', async () => {
      await expect(canvas.getByText('Visible columns: id, customer, amount')).toBeInTheDocument();
    });
  }
};

const PersistedStatePreview = () => {
  const [tableInstance, setTableInstance] = useState(0);

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button
          size='sm'
          variant='secondary'
          onClick={() => {
            window.localStorage.removeItem(persistedStoryStorageKey);
            setTableInstance((value) => value + 1);
          }}
        >
          Reset persisted state
        </Button>
        <span className={storyStyles.meta}>Persist key: {persistedStoryStorageKey}</span>
      </div>

      <DataTable
        key={tableInstance}
        data={rows}
        columns={columns}
        rowKey='id'
        persistStateKey={persistedStoryStorageKey}
        columnVisibility={{
          defaultVisibleColumnIds: ['id', 'customer', 'status', 'issuedAt'],
          nonHideableColumnIds: ['id']
        }}
        defaultSort={{ columnId: 'issuedAt', direction: 'desc' }}
        defaultPageSize={3}
        pageSizeOptions={[3, 5, 10]}
      />
      <p className={storyStyles.meta}>
        Change sort/page/page size/visible columns, then refresh the story. State restores from localStorage.
      </p>
    </div>
  );
};

export const PersistedState: Story = {
  render: () => <PersistedStatePreview />,
  play: async ({ canvas, step }) => {
    await step('Reset persisted state', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Reset persisted state' }));
    });

    await step('Change sort and pagination', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Customer' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
      await userEvent.selectOptions(canvas.getByRole('combobox'), '5');
    });

    await step('Persist visibility change', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
      await userEvent.click(await screen.findByRole('checkbox', { name: 'Toggle column Status' }));
    });

    await step('Verify localStorage payload', async () => {
      await waitFor(async () => {
        const raw = window.localStorage.getItem(persistedStoryStorageKey);
        await expect(raw).toBeTruthy();

        const parsed = JSON.parse(raw ?? '{}') as {
          version?: string;
          sort?: DataTableSortState;
          page?: number;
          pageSize?: number;
          visibleColumnIds?: string[];
        };

        await expect(parsed.version).toBe('v1');
        await expect(parsed.sort).toEqual({ columnId: 'customer', direction: 'asc' });
        await expect(parsed.page).toBe(2);
        await expect(parsed.pageSize).toBe(5);
        await expect(parsed.visibleColumnIds).not.toContain('status');
      });
    });
  }
};
