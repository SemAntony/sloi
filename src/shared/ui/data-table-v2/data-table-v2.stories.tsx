import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentType, useState } from 'react';
import { expect, fireEvent, screen, userEvent } from 'storybook/test';
import { type DataTableColumn } from '../data-table';
import {
  DataTableV2,
  type DataTableV2ColumnPinningState,
  type DataTableV2ColumnSizeState
} from './index';

type InvoiceRow = {
  id: string;
  customer: string;
  amount: number;
};

type VirtualizationBenchmarkRow = {
  id: string;
  label: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
};

const rows: InvoiceRow[] = [
  { id: 'INV-2001', customer: 'Acme Co.', amount: 1200 },
  { id: 'INV-2002', customer: 'Globex', amount: 860 },
  { id: 'INV-2003', customer: 'Initech', amount: 430 }
];

const virtualRows: InvoiceRow[] = Array.from({ length: 600 }, (_, index) => {
  const number = index + 1;
  return {
    id: `INV-${3000 + number}`,
    customer: `Customer ${number}`,
    amount: 100 + number * 7
  };
});

const benchmarkStatuses: Array<VirtualizationBenchmarkRow['status']> = ['paid', 'pending', 'overdue'];
const virtualizationBenchmarkRows: VirtualizationBenchmarkRow[] = Array.from({ length: 10_000 }, (_, index) => {
  const number = index + 1;
  return {
    id: `BILL-${number.toString().padStart(5, '0')}`,
    label: `Account ${number}`,
    status: benchmarkStatuses[index % benchmarkStatuses.length],
    amount: 120 + (number % 850) * 9
  };
});

const columns: DataTableColumn<InvoiceRow>[] = [
  { id: 'id', header: 'Invoice', accessor: 'id', sortable: true, width: 160 },
  { id: 'customer', header: 'Customer', accessor: 'customer', sortable: true, width: 220 },
  { id: 'amount', header: 'Amount', accessor: 'amount', sortable: true, align: 'right' as const, width: 140 }
];

const virtualizationBenchmarkColumns: DataTableColumn<VirtualizationBenchmarkRow>[] = [
  { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 160 },
  { id: 'label', header: 'Label', accessor: 'label', sortable: true, width: 260 },
  { id: 'status', header: 'Status', accessor: 'status', sortable: true, width: 160 },
  { id: 'amount', header: 'Amount', accessor: 'amount', sortable: true, align: 'right' as const, width: 160 }
];

const meta = {
  title: 'UI/DataTableV2',
  component: DataTableV2 as unknown as ComponentType
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DataTableV2 data={rows} columns={columns} rowKey='id' />
};

const pinningDefault: DataTableV2ColumnPinningState = {
  left: [],
  right: []
};

const pinningLeft: DataTableV2ColumnPinningState = {
  left: ['id'],
  right: []
};

const pinningRight: DataTableV2ColumnPinningState = {
  left: [],
  right: ['amount']
};

const pinningMixed: DataTableV2ColumnPinningState = {
  left: ['customer'],
  right: ['amount']
};

export const PinningDefault: Story = {
  render: () => (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnPinning
      defaultPinnedColumns={pinningDefault}
    />
  )
};

export const PinningLeft: Story = {
  render: () => (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnPinning
      defaultPinnedColumns={pinningLeft}
    />
  )
};

export const PinningRight: Story = {
  render: () => (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnPinning
      defaultPinnedColumns={pinningRight}
    />
  )
};

export const PinningMixed: Story = {
  render: () => (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnPinning
      defaultPinnedColumns={pinningMixed}
    />
  ),
  play: async ({ canvas, step }) => {
    await step('Keep mixed pin order while sorting Amount', async () => {
      const amountSortButton = canvas.getByRole('button', { name: 'Amount' });
      await userEvent.click(amountSortButton);

      const amountHeader = canvas.getByRole('columnheader', { name: 'Amount' });
      await expect(amountHeader).toHaveAttribute('aria-sort', 'ascending');

      const headerOrder = canvas
        .getAllByRole('columnheader')
        .map((header) => header.textContent?.replace('↕', '').replace('▲', '').replace('▼', '').trim());
      await expect(headerOrder).toEqual(['Customer', 'Invoice', 'Amount']);
    });
  }
};

export const PinningKeyboardFlow: Story = {
  render: () => (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnPinning
    />
  ),
  play: async ({ canvas, step }) => {
    await step('Open pinning controls using keyboard', async () => {
      const pinColumnsButton = canvas.getByRole('button', { name: 'Pin columns' });
      pinColumnsButton.focus();
      await userEvent.keyboard('{Enter}');
      await expect(await screen.findByRole('button', { name: 'Pin column Customer left' })).toBeInTheDocument();
    });

    await step('Pin Customer to the left using keyboard', async () => {
      const pinCustomerLeft = screen.getByRole('button', { name: 'Pin column Customer left' });
      pinCustomerLeft.focus();
      await userEvent.keyboard('{Enter}');

      const headerOrder = canvas
        .getAllByRole('columnheader')
        .map((header) => header.textContent?.replace('↕', '').trim());
      await expect(headerOrder).toEqual(['Customer', 'Invoice', 'Amount']);
    });
  }
};

export const PinningWithColumnVisibility: Story = {
  render: () => (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnPinning
      defaultPinnedColumns={pinningLeft}
      columnVisibility={{
        defaultVisibleColumnIds: ['id', 'customer', 'amount']
      }}
    />
  ),
  play: async ({ canvas, step }) => {
    await step('Hide pinned column via Columns popover', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
      const invoiceToggle = await screen.findByRole('checkbox', { name: 'Toggle column Invoice' });
      await userEvent.click(invoiceToggle);
      await expect(canvas.queryByRole('columnheader', { name: 'Invoice' })).not.toBeInTheDocument();
      await userEvent.click(invoiceToggle);
      await expect(canvas.getByRole('columnheader', { name: 'Invoice' })).toBeInTheDocument();

      const headerOrder = canvas
        .getAllByRole('columnheader')
        .map((header) => header.textContent?.replace('↕', '').replace('▲', '').replace('▼', '').trim());
      await expect(headerOrder[0]).toBe('Invoice');
    });
  }
};

export const PinningFocusOrderRegression: Story = {
  render: () => (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnPinning
      defaultPinnedColumns={pinningLeft}
    />
  ),
  play: async ({ canvas, step }) => {
    await step('Verify keyboard focus order in pinning actions', async () => {
      const pinColumnsButton = canvas.getByRole('button', { name: 'Pin columns' });
      pinColumnsButton.focus();
      await userEvent.keyboard('{Enter}');

      const pinInvoiceRight = await screen.findByRole('button', { name: 'Pin column Invoice right' });
      pinInvoiceRight.focus();
      await userEvent.tab();
      await expect(screen.getByRole('button', { name: 'Unpin column Invoice' })).toHaveFocus();
      await userEvent.tab();
      await expect(screen.getByRole('button', { name: 'Pin column Customer left' })).toHaveFocus();
    });
  }
};

export const ResizeDefault: Story = {
  render: () => (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnResize
    />
  )
};

export const ResizeMinMax: Story = {
  render: () => (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnResize
      minColumnWidth={120}
      maxColumnWidth={260}
      defaultColumnSizes={{
        customer: 220
      }}
    />
  )
};

const ControlledResizePreview = () => {
  const [columnSizes, setColumnSizes] = useState<DataTableV2ColumnSizeState>({
    id: 180,
    customer: 240
  });

  return (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      enableColumnResize
      columnSizes={columnSizes}
      onColumnSizesChange={setColumnSizes}
    />
  );
};

export const ResizeKeyboard: Story = {
  render: () => <ControlledResizePreview />,
  play: async ({ canvas, step }) => {
    await step('Resize customer column using keyboard arrows', async () => {
      const handle = canvas.getByRole('button', { name: 'Resize column Customer' });
      const headerCell = canvas.getByRole('columnheader', { name: 'Customer' });
      const widthBefore = Number.parseFloat((headerCell as HTMLElement).style.width);

      handle.focus();
      await userEvent.keyboard('{ArrowRight}');
      const widthAfter = Number.parseFloat((headerCell as HTMLElement).style.width);

      await expect(widthAfter).toBeGreaterThan(widthBefore);
    });
  }
};

export const VirtualizationSmallDataset: Story = {
  render: () => (
    <DataTableV2
      data={virtualRows.slice(0, 80)}
      columns={columns}
      rowKey='id'
      showPagination={false}
      enableVirtualization
      rowHeight={44}
      overscan={4}
    />
  )
};

const VirtualizationKeyboardPreview = () => {
  const [selectedRowId, setSelectedRowId] = useState<string>('none');

  return (
    <div>
      <p data-testid='virtualization-selected'>Selected row: {selectedRowId}</p>
      <DataTableV2
        data={virtualRows}
        columns={columns}
        rowKey='id'
        showPagination={false}
        enableVirtualization
        rowHeight={44}
        overscan={8}
        onRowClick={(row) => {
          setSelectedRowId(row.id);
        }}
      />
    </div>
  );
};

export const VirtualizationLargeDataset: Story = {
  render: () => <VirtualizationKeyboardPreview />,
  play: async ({ canvas, step }) => {
    await step('Scroll to deep rows in virtualized viewport', async () => {
      const viewport = canvas.getByLabelText('DataTable virtualized viewport');
      fireEvent.scroll(viewport, { target: { scrollTop: 44 * 70 } });
      await expect(canvas.getByText('INV-3071')).toBeInTheDocument();
    });

    await step('Activate row with keyboard in virtualized mode', async () => {
      const rowCell = canvas.getByText('INV-3071');
      const row = rowCell.closest('tr');
      if (!row) {
        throw new Error('Expected table row for INV-3071.');
      }

      (row as HTMLElement).focus();
      await userEvent.keyboard('{Enter}');

      await expect(canvas.getByTestId('virtualization-selected')).toHaveTextContent('Selected row: INV-3071');
    });
  }
};

export const VirtualizationReferenceDataset: Story = {
  render: () => (
    <DataTableV2
      data={virtualizationBenchmarkRows}
      columns={virtualizationBenchmarkColumns}
      rowKey='id'
      showPagination={false}
      enableVirtualization
      rowHeight={44}
      overscan={8}
    />
  )
};
