import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { DataTableV2 } from './data-table-v2';

describe('DataTableV2 a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <DataTableV2
        data={[{ id: 'INV-1', name: 'Alice' }]}
        rowKey='id'
        columns={[
          { id: 'id', header: 'ID', accessor: 'id' },
          { id: 'name', header: 'Name', accessor: 'name' }
        ]}
      />
    );

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations with pinning controls open', async () => {
    const user = userEvent.setup();

    render(
      <DataTableV2
        data={[
          { id: 'INV-1', customer: 'Alice', amount: 120 },
          { id: 'INV-2', customer: 'Bob', amount: 80 }
        ]}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 120 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 180 },
          { id: 'amount', header: 'Amount', accessor: 'amount', width: 120 }
        ]}
        enableColumnPinning
      />
    );

    await user.click(screen.getByRole('button', { name: 'Pin columns' }));
    await screen.findByRole('button', { name: 'Pin column Customer left' });

    const pinningLegend = screen.getByText('Column pinning');
    const openPopoverContent = pinningLegend.closest('[data-side]');
    if (!openPopoverContent) {
      throw new Error('Expected open pinning popover content.');
    }

    const results = await axe(openPopoverContent, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations with resize handles', async () => {
    const { container } = render(
      <DataTableV2
        data={[
          { id: 'INV-1', customer: 'Alice' },
          { id: 'INV-2', customer: 'Bob' }
        ]}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 140 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 }
        ]}
        enableColumnResize
      />
    );

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('keeps table semantics and has no detectable accessibility violations in virtualized mode', async () => {
    const rows = Array.from({ length: 300 }, (_, index) => ({
      id: `INV-${5000 + index}`,
      customer: `Customer ${index + 1}`
    }));

    const { container } = render(
      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', width: 160 },
          { id: 'customer', header: 'Customer', accessor: 'customer', width: 220 }
        ]}
        showPagination={false}
        enableVirtualization
        rowHeight={40}
        overscan={4}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
