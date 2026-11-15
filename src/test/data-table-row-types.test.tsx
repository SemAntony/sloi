import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from '../shared/ui/data-table';
import {
  DataTableV2,
  type DataTableV2Column,
  type DataTableV2ColumnId,
  type DataTableV2ColumnVisibility,
  type DataTableV2Props,
  type DataTableV2RowSelection,
  type DataTableV2RowSelectionContext,
  type DataTableV2SelectionKey,
  type DataTableV2SortState
} from '../shared/ui/data-table-v2';

// P3 (D39): строки, объявленные как `interface`, не имеют index signature и раньше не
// проходили ограничение `T extends Record<string, unknown>`. Падение теперь на этапе typecheck.
interface InvoiceRow {
  id: number;
  customer: string;
}

const rows: InvoiceRow[] = [
  { id: 1, customer: 'Acme' },
  { id: 2, customer: 'Globex' }
];

describe('DataTable / DataTableV2 принимают строки-interface (D39)', () => {
  it('DataTable рендерит interface-строки', () => {
    render(
      <DataTable
        data={rows}
        rowKey='id'
        columns={[{ id: 'customer', header: 'Customer', accessor: 'customer' }]}
      />
    );
    expect(screen.getByText('Acme')).toBeTruthy();
  });

  it('DataTableV2 рендерит interface-строки', () => {
    render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[{ id: 'customer', header: 'Customer', accessor: 'customer' }]}
      />
    );
    expect(screen.getByText('Globex')).toBeTruthy();
  });

  it('V2-типы доступны под своими именами (P7)', () => {
    const column: DataTableV2Column<InvoiceRow> = { id: 'customer', header: 'Customer', accessor: 'customer' };
    const sort: DataTableV2SortState = { columnId: 'customer', direction: 'asc' };
    const columnId: DataTableV2ColumnId = 'customer';
    const key: DataTableV2SelectionKey = '1';
    const visibility: DataTableV2ColumnVisibility = { visibleColumnIds: [columnId] };
    const selection: DataTableV2RowSelection<InvoiceRow> = {
      selectedKeys: [key],
      renderBulkActions: (context: DataTableV2RowSelectionContext<InvoiceRow>) => context.selectedCount
    };
    const props: Pick<DataTableV2Props<InvoiceRow>, 'columns' | 'sort'> = { columns: [column], sort };

    expect(props.columns).toHaveLength(1);
    expect(visibility.visibleColumnIds).toEqual(['customer']);
    expect(selection.selectedKeys).toEqual(['1']);
  });
});
