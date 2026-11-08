import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { DataTable, type DataTableColumn } from './data-table';

type Row = {
  id: string;
  name: string;
};

const columns: DataTableColumn<Row>[] = [
  { id: 'id', header: 'ID', accessor: 'id' },
  { id: 'name', header: 'Name', accessor: 'name' }
];

describe('DataTable a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(<DataTable data={[{ id: '1', name: 'Alice' }]} columns={columns} rowKey='id' />);
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
