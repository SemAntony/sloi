import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Button } from '../button';
import { DataTable, type DataTableColumn, type DataTableSortState } from '../data-table';
import { FilterBar } from '../filter-bar';
import styles from './data-examples.stories.module.scss';

type TicketRow = {
  id: string;
  customer: string;
  channel: 'Email' | 'Chat' | 'Phone';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
};

const rows: TicketRow[] = [
  { id: 'T-401', customer: 'Acme Co.', channel: 'Email', priority: 'High', createdAt: '2026-03-18' },
  { id: 'T-402', customer: 'Northwind', channel: 'Chat', priority: 'Medium', createdAt: '2026-03-20' },
  { id: 'T-403', customer: 'Globex', channel: 'Phone', priority: 'High', createdAt: '2026-03-22' },
  { id: 'T-404', customer: 'Initech', channel: 'Email', priority: 'Low', createdAt: '2026-03-24' },
  { id: 'T-405', customer: 'Umbrella', channel: 'Chat', priority: 'Medium', createdAt: '2026-03-25' },
  { id: 'T-406', customer: 'Stark', channel: 'Phone', priority: 'High', createdAt: '2026-03-26' },
  { id: 'T-407', customer: 'Wayne', channel: 'Email', priority: 'Medium', createdAt: '2026-03-27' },
  { id: 'T-408', customer: 'Wonka', channel: 'Chat', priority: 'Low', createdAt: '2026-03-28' }
];

const columns: DataTableColumn<TicketRow>[] = [
  { id: 'id', header: 'Ticket', accessor: 'id', sortable: true },
  { id: 'customer', header: 'Customer', accessor: 'customer', sortable: true },
  { id: 'channel', header: 'Channel', accessor: 'channel', sortable: true },
  { id: 'priority', header: 'Priority', accessor: 'priority', sortable: true },
  {
    id: 'createdAt',
    header: 'Created',
    sortable: true,
    sortAccessor: (row) => new Date(row.createdAt),
    cell: (row) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(row.createdAt))
  }
];

const sortServerRows = (rowsToSort: TicketRow[], sort: DataTableSortState | undefined) => {
  if (!sort) {
    return rowsToSort;
  }

  const direction = sort.direction === 'asc' ? 1 : -1;

  const getValue = (row: TicketRow) => {
    if (sort.columnId === 'createdAt') {
      return new Date(row.createdAt).getTime();
    }

    return String(row[sort.columnId as keyof TicketRow]).toLowerCase();
  };

  return [...rowsToSort]
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

const meta = {
  title: 'UI/Patterns/Data Examples'
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const DataExamplePreview = () => {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<'all' | TicketRow['priority']>('all');
  const [sort, setSort] = useState<DataTableSortState | undefined>({
    columnId: 'createdAt',
    direction: 'desc'
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [serverRows, setServerRows] = useState<TicketRow[]>([]);
  const [totalItems, setTotalItems] = useState(rows.length);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [lastBulkAction, setLastBulkAction] = useState<string | null>(null);

  useEffect(() => {
    // Story имитирует серверный запрос: «loading» включается на время фейковой задержки.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      const filtered = rows.filter((row) => {
        const byPriority = priority === 'all' ? true : row.priority === priority;
        const byQuery = query.trim()
          ? `${row.id} ${row.customer} ${row.channel} ${row.priority}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())
          : true;

        return byPriority && byQuery;
      });

      const sorted = sortServerRows(filtered, sort);
      const nextTotalItems = sorted.length;
      const nextTotalPages = Math.max(1, Math.ceil(nextTotalItems / pageSize));
      const safePage = Math.min(page, nextTotalPages);
      const start = (safePage - 1) * pageSize;
      const pageSlice = sorted.slice(start, start + pageSize);

      if (safePage !== page) {
        setPage(safePage);
      }

      setTotalItems(nextTotalItems);
      setServerRows(pageSlice);
      setLoading(false);
    }, 420);

    return () => window.clearTimeout(timeoutId);
  }, [page, pageSize, priority, query, sort]);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Support Inbox</h2>
      <p className={styles.subtitle}>A practical pattern with filters, search and sortable table.</p>

      <FilterBar
        query={query}
        onQueryChange={(nextQuery) => {
          setQuery(nextQuery);
          setSelectedKeys([]);
          setLastBulkAction(null);
        }}
        onSearch={(nextQuery) => {
          setQuery(nextQuery);
          setSelectedKeys([]);
          setLastBulkAction(null);
        }}
        onReset={() => {
          setQuery('');
          setPriority('all');
          setSort({ columnId: 'createdAt', direction: 'desc' });
          setPage(1);
          setSelectedKeys([]);
          setLastBulkAction(null);
        }}
        filters={
          <label>
            Priority
            <select
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value as 'all' | TicketRow['priority']);
                setSelectedKeys([]);
                setLastBulkAction(null);
              }}
            >
              <option value='all'>All</option>
              <option value='High'>High</option>
              <option value='Medium'>Medium</option>
              <option value='Low'>Low</option>
            </select>
          </label>
        }
        actions={<Button size='sm'>Export CSV</Button>}
      />

      <DataTable
        processingMode='server'
        data={serverRows}
        totalItems={totalItems}
        columns={columns}
        rowKey='id'
        striped
        loading={loading}
        sort={sort}
        onSortChange={(nextSort) => {
          setSort(nextSort);
          setPage(1);
          setSelectedKeys([]);
          setLastBulkAction(null);
        }}
        page={page}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          setSelectedKeys([]);
          setLastBulkAction(null);
        }}
        pageSize={pageSize}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
          setSelectedKeys([]);
          setLastBulkAction(null);
        }}
        pageSizeOptions={[5, 10]}
        emptyMessage='No tickets match current filters.'
        rowSelection={{
          selectedKeys,
          onSelectedKeysChange: (nextKeys) => {
            setSelectedKeys(nextKeys);
            setLastBulkAction(null);
          },
          renderBulkActions: ({ selectedRows, clearSelection }) => (
            <>
              <Button
                size='sm'
                variant='secondary'
                onClick={() => {
                  setLastBulkAction(`Assigned ${selectedRows.length} ticket(s) to Tier 2.`);
                  clearSelection();
                }}
              >
                Assign to Tier 2
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  setLastBulkAction(`Closed ${selectedRows.length} ticket(s).`);
                  clearSelection();
                }}
              >
                Close tickets
              </Button>
            </>
          )
        }}
      />

      <p className={styles.meta}>
        Server mode: showing {serverRows.length} of {totalItems} tickets (page {page}).
        {lastBulkAction ? ` ${lastBulkAction}` : ''}
      </p>
    </section>
  );
};

export const FilterableSupportTable: Story = {
  render: () => <DataExamplePreview />
};
