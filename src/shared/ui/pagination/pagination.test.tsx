import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination, type PaginationProps } from './pagination';

const ELLIPSIS = '...';

const renderPagination = (props: Partial<PaginationProps> = {}) =>
  render(<Pagination totalItems={100} showPageSizeSelector={false} {...props} />);

/** Видимая последовательность: числа страниц и многоточия по порядку. */
const visibleItems = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('ul > li')).map((item) => item.textContent ?? '');

const currentPageOf = () => screen.getByRole('button', { current: 'page' }).textContent;
const summary = (container: HTMLElement) => container.querySelector('p')?.textContent;

describe('Pagination: page range (D15)', () => {
  // totalItems = pages * 10 при pageSize 10
  const cases: Array<{ name: string; pages: number; page: number; siblingCount?: number; expected: Array<number | string> }> = [
    { name: 'one page', pages: 1, page: 1, expected: [1] },
    { name: 'all pages fit (7 pages, siblings 1)', pages: 7, page: 4, expected: [1, 2, 3, 4, 5, 6, 7] },
    { name: 'first page of many', pages: 20, page: 1, expected: [1, 2, 3, 4, 5, ELLIPSIS, 20] },
    { name: 'page 3 still has no left ellipsis', pages: 20, page: 3, expected: [1, 2, 3, 4, 5, ELLIPSIS, 20] },
    { name: 'page 4 gets a left ellipsis', pages: 20, page: 4, expected: [1, ELLIPSIS, 3, 4, 5, ELLIPSIS, 20] },
    { name: 'middle page', pages: 20, page: 10, expected: [1, ELLIPSIS, 9, 10, 11, ELLIPSIS, 20] },
    { name: 'page 17 still has a right ellipsis', pages: 20, page: 17, expected: [1, ELLIPSIS, 16, 17, 18, ELLIPSIS, 20] },
    { name: 'page 18 has no right ellipsis', pages: 20, page: 18, expected: [1, ELLIPSIS, 16, 17, 18, 19, 20] },
    { name: 'last page', pages: 20, page: 20, expected: [1, ELLIPSIS, 16, 17, 18, 19, 20] },
    { name: 'siblings 2, middle', pages: 20, page: 10, siblingCount: 2, expected: [1, ELLIPSIS, 8, 9, 10, 11, 12, ELLIPSIS, 20] },
    { name: 'siblings 2, first page', pages: 20, page: 1, siblingCount: 2, expected: [1, 2, 3, 4, 5, 6, 7, ELLIPSIS, 20] },
    { name: 'siblings 0, middle', pages: 20, page: 10, siblingCount: 0, expected: [1, ELLIPSIS, 10, ELLIPSIS, 20] },
    { name: 'negative siblings behave as 0', pages: 20, page: 10, siblingCount: -3, expected: [1, ELLIPSIS, 10, ELLIPSIS, 20] }
  ];

  it.each(cases)('$name', ({ pages, page, siblingCount, expected }) => {
    const { container } = renderPagination({
      totalItems: pages * 10,
      defaultPage: page,
      defaultPageSize: 10,
      siblingCount
    });

    expect(visibleItems(container)).toEqual(expected.map(String));
    expect(currentPageOf()).toBe(String(page));
  });

  it('marks ellipses as hidden from assistive tech', () => {
    const { container } = renderPagination({ totalItems: 200, defaultPage: 10 });

    const ellipses = Array.from(container.querySelectorAll('li')).filter((li) => li.textContent === ELLIPSIS);
    expect(ellipses).toHaveLength(2);
    for (const item of ellipses) {
      expect(item).toHaveAttribute('aria-hidden', 'true');
    }
  });
});

describe('Pagination: boundaries and summary (D15)', () => {
  it('disables Prev on the first page and Next on the last page', async () => {
    const user = userEvent.setup();
    renderPagination({ totalItems: 30, defaultPageSize: 10 });

    expect(screen.getByRole('button', { name: 'Prev' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(currentPageOf()).toBe('3');
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Prev' })).toBeEnabled();
  });

  it('shows the item range, including a partial last page', () => {
    const { container } = renderPagination({ totalItems: 25, defaultPage: 3, defaultPageSize: 10 });

    expect(summary(container)).toBe('Showing 21-25 of 25');
  });

  it('handles an empty list: one page, 0-0 of 0', () => {
    const { container } = renderPagination({ totalItems: 0 });

    expect(summary(container)).toBe('Showing 0-0 of 0');
    expect(visibleItems(container)).toEqual(['1']);
    expect(screen.getByRole('button', { name: 'Prev' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('treats negative totalItems as empty', () => {
    const { container } = renderPagination({ totalItems: -5 });

    expect(summary(container)).toBe('Showing 0-0 of 0');
  });

  it('clamps an out-of-range page into 1..totalPages', () => {
    const { rerender } = render(<Pagination totalItems={30} page={99} pageSize={10} showPageSizeSelector={false} />);
    expect(currentPageOf()).toBe('3');

    rerender(<Pagination totalItems={30} page={0} pageSize={10} showPageSizeSelector={false} />);
    expect(currentPageOf()).toBe('1');
  });

  it('treats pageSize below 1 as 1', () => {
    const { container } = renderPagination({ totalItems: 3, pageSize: 0 });

    expect(visibleItems(container)).toEqual(['1', '2', '3']);
    expect(summary(container)).toBe('Showing 1-1 of 3');
  });

  it('disables every control when disabled', () => {
    renderPagination({ totalItems: 100, defaultPage: 5, disabled: true, showPageSizeSelector: true });

    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    for (const button of within(nav).getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
    expect(screen.getByRole('combobox', { name: 'Rows' })).toBeDisabled();
  });
});

describe('Pagination: controlled / uncontrolled page (D15)', () => {
  it('uncontrolled: moves on click and reports the new page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderPagination({ totalItems: 100, onPageChange });

    await user.click(screen.getByRole('button', { name: '3' }));

    expect(currentPageOf()).toBe('3');
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith(3);
  });

  it('controlled: reports the request but only moves when the prop changes', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination totalItems={100} page={2} onPageChange={onPageChange} showPageSizeSelector={false} />
    );

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(onPageChange).toHaveBeenCalledExactlyOnceWith(3);
    expect(currentPageOf()).toBe('2');

    rerender(<Pagination totalItems={100} page={3} onPageChange={onPageChange} showPageSizeSelector={false} />);
    expect(currentPageOf()).toBe('3');
  });
});

describe('Pagination: page size (D15)', () => {
  const sizeSelect = () => screen.getByRole('combobox', { name: 'Rows' });
  const chooseSize = async (user: ReturnType<typeof userEvent.setup>, size: string) => {
    sizeSelect().focus();
    await user.keyboard('{Enter}');
    await user.click(await screen.findByRole('option', { name: size }));
  };

  it('uncontrolled: changes the size, recomputes the range, reports it', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    const { container } = render(
      <Pagination totalItems={95} onPageSizeChange={onPageSizeChange} pageSizeOptions={[10, 20, 50]} />
    );

    await chooseSize(user, '50');

    expect(sizeSelect()).toHaveTextContent('50');
    expect(onPageSizeChange).toHaveBeenCalledExactlyOnceWith(50);
    expect(summary(container)).toBe('Showing 1-50 of 95');
    expect(visibleItems(container)).toEqual(['1', '2']);
  });

  it('keeps the page inside the new range when the size grows past it', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination totalItems={95} defaultPage={10} onPageChange={onPageChange} pageSizeOptions={[10, 50]} />
    );
    expect(summary(container)).toBe('Showing 91-95 of 95');

    await chooseSize(user, '50');

    expect(currentPageOf()).toBe('2');
    expect(summary(container)).toBe('Showing 51-95 of 95');
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith(2);
  });

  it('does not report a page change when the page stays the same', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalItems={95} defaultPage={1} onPageChange={onPageChange} pageSizeOptions={[10, 20]} />);

    await chooseSize(user, '20');

    expect(currentPageOf()).toBe('1');
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('controlled: reports the request but keeps the displayed size until the prop changes', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    const { rerender } = render(
      <Pagination totalItems={95} pageSize={10} onPageSizeChange={onPageSizeChange} pageSizeOptions={[10, 20]} />
    );

    await chooseSize(user, '20');

    expect(onPageSizeChange).toHaveBeenCalledExactlyOnceWith(20);
    expect(sizeSelect()).toHaveTextContent('10');

    rerender(<Pagination totalItems={95} pageSize={20} onPageSizeChange={onPageSizeChange} pageSizeOptions={[10, 20]} />);
    expect(sizeSelect()).toHaveTextContent('20');
  });
});

describe('Pagination: labels and page-size Select (D16)', () => {
  it('uses English defaults', () => {
    const { container } = render(<Pagination totalItems={95} />);

    expect(screen.getByRole('button', { name: 'Prev' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Rows' })).toBeTruthy();
    expect(summary(container)).toBe('Showing 1-10 of 95');
  });

  it('takes every text from labels, including the summary word order', () => {
    const { container } = render(
      <Pagination
        totalItems={95}
        navigationLabel='Страницы'
        labels={{
          previous: 'Назад',
          next: 'Вперёд',
          rows: 'Строк',
          summary: ({ from, to, total }) => `${total} всего, показано ${from}–${to}`
        }}
      />
    );

    expect(screen.getByRole('navigation', { name: 'Страницы' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Назад' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Вперёд' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Строк' })).toBeTruthy();
    expect(summary(container)).toBe('95 всего, показано 1–10');
  });

  it('keeps defaults for labels that are not overridden', () => {
    render(<Pagination totalItems={95} labels={{ next: 'Siguiente' }} />);

    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Prev' })).toBeTruthy();
  });

  it('uses the library Select instead of a native <select>', () => {
    const { container } = render(<Pagination totalItems={95} />);

    expect(container.querySelector('select')).toBeNull();
    expect(screen.getByRole('combobox', { name: 'Rows' }).tagName).toBe('BUTTON');
  });

  it('always offers the current page size, even when it is missing from pageSizeOptions', async () => {
    const user = userEvent.setup();
    render(<Pagination totalItems={95} defaultPageSize={25} pageSizeOptions={[10, 20, 50]} />);

    const trigger = screen.getByRole('combobox', { name: 'Rows' });
    expect(trigger).toHaveTextContent('25');

    trigger.focus();
    await user.keyboard('{Enter}');
    // индикатор выбранной опции это svg, в текст он не попадает
    const options = (await screen.findAllByRole('option')).map((option) => option.textContent);
    expect(options).toEqual(['10', '20', '25', '50']);
  });
});
