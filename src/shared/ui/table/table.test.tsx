import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './table';

type TableTestProps = Partial<React.ComponentProps<typeof Table>>;

function renderTable(props: TableTestProps = {}) {
  return render(
    <Table aria-label='Users' {...props}>
      <TableHead>
        <TableRow>
          <TableHeaderCell scope='col'>Name</TableHeaderCell>
          <TableHeaderCell scope='col' align='right'>
            Age
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Ann</TableCell>
          <TableCell align='center'>31</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell align='right'>27</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('Table', () => {
  it('рендерит семантическую таблицу: table, rowgroup, columnheader, cell', () => {
    renderTable();

    const table = screen.getByRole('table', { name: 'Users' });
    expect(within(table).getAllByRole('rowgroup')).toHaveLength(2);
    expect(within(table).getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual(['Name', 'Age']);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['Ann', '31', 'Bob', '27']);
  });

  it('оборачивает table в контейнер, containerClassName идёт на контейнер, className на table', () => {
    renderTable({ className: 'on-table', containerClassName: 'on-container' });

    const table = screen.getByRole('table');
    const container = table.parentElement as HTMLElement;
    expect(container).toHaveClass('on-container');
    expect(container).not.toHaveClass('on-table');
    expect(table).toHaveClass('on-table');
    expect(table.className).toMatch(/table/);
  });

  it('пробрасывает ref и нативные атрибуты на table', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref} aria-label='Users' data-testid='users'>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(ref.current).toBe(screen.getByTestId('users'));
    expect(ref.current?.tagName).toBe('TABLE');
  });

  describe('флаги контейнера', () => {
    it('по умолчанию нет striped, sticky и compact', () => {
      renderTable();

      const container = screen.getByRole('table').parentElement as HTMLElement;
      expect(container.className).not.toMatch(/striped/);
      expect(container.className).not.toMatch(/stickyHeader/);
      expect(container.className).not.toMatch(/compact/);
    });

    it('striped, stickyHeader и density="compact" добавляют классы', () => {
      renderTable({ striped: true, stickyHeader: true, density: 'compact' });

      const container = screen.getByRole('table').parentElement as HTMLElement;
      expect(container.className).toMatch(/striped/);
      expect(container.className).toMatch(/stickyHeader/);
      expect(container.className).toMatch(/compact/);
    });

    it('density="comfortable" не добавляет compact', () => {
      renderTable({ density: 'comfortable' });

      expect((screen.getByRole('table').parentElement as HTMLElement).className).not.toMatch(/compact/);
    });

    it('флаги работают независимо друг от друга', () => {
      renderTable({ striped: true });

      const container = screen.getByRole('table').parentElement as HTMLElement;
      expect(container.className).toMatch(/striped/);
      expect(container.className).not.toMatch(/stickyHeader/);
    });
  });

  describe('выравнивание ячеек', () => {
    it('по умолчанию left у th и td', () => {
      renderTable();

      expect(screen.getByRole('columnheader', { name: 'Name' }).className).toMatch(/alignLeft/);
      expect(screen.getByRole('cell', { name: 'Ann' }).className).toMatch(/alignLeft/);
    });

    it('align center и right применяются к th и td', () => {
      renderTable();

      expect(screen.getByRole('columnheader', { name: 'Age' }).className).toMatch(/alignRight/);
      expect(screen.getByRole('cell', { name: '31' }).className).toMatch(/alignCenter/);
      expect(screen.getByRole('cell', { name: '27' }).className).toMatch(/alignRight/);
    });

    it('align не попадает в DOM как атрибут', () => {
      renderTable();

      expect(screen.getByRole('cell', { name: '31' })).not.toHaveAttribute('align');
    });
  });

  it('части таблицы пробрасывают ref, className и нативные атрибуты', () => {
    const head = createRef<HTMLTableSectionElement>();
    const body = createRef<HTMLTableSectionElement>();
    const row = createRef<HTMLTableRowElement>();
    const th = createRef<HTMLTableCellElement>();
    const td = createRef<HTMLTableCellElement>();

    render(
      <Table aria-label='Parts'>
        <TableHead ref={head} className='h'>
          <TableRow ref={row} className='r'>
            <TableHeaderCell ref={th} className='th' scope='col'>
              Col
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody ref={body} className='b'>
          <TableRow>
            <TableCell ref={td} className='td' colSpan={1}>
              Cell
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(head.current?.tagName).toBe('THEAD');
    expect(head.current).toHaveClass('h');
    expect(body.current?.tagName).toBe('TBODY');
    expect(body.current).toHaveClass('b');
    expect(row.current?.tagName).toBe('TR');
    expect(row.current).toHaveClass('r');
    expect(th.current?.tagName).toBe('TH');
    expect(th.current).toHaveClass('th');
    expect(th.current).toHaveAttribute('scope', 'col');
    expect(td.current?.tagName).toBe('TD');
    expect(td.current).toHaveClass('td');
    expect(td.current).toHaveAttribute('colspan', '1');
  });

  it('displayName задан у всех частей', () => {
    expect([Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell].map((part) => part.displayName)).toEqual([
      'Table',
      'TableHead',
      'TableBody',
      'TableRow',
      'TableHeaderCell',
      'TableCell'
    ]);
  });

  describe('a11y', () => {
    const options = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } };

    it('нет нарушений: базовая и со всеми флагами', async () => {
      const { container } = renderTable({ striped: true, stickyHeader: true, density: 'compact' });

      expect((await axe(container, options)).violations).toHaveLength(0);
    });
  });
});
