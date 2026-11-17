import { forwardRef, useMemo, useState, type HTMLAttributes } from 'react';
import { Button } from '../button';
import { cn } from '../../lib/cn/cn';
import styles from './pagination.module.scss';

type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const buildPageItems = (page: number, totalPages: number, siblingCount: number): PaginationItem[] => {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftRange = range(1, 3 + siblingCount * 2);
    return [...leftRange, 'ellipsis-right', totalPages];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightRange = range(totalPages - (2 + siblingCount * 2), totalPages);
    return [1, 'ellipsis-left', ...rightRange];
  }

  const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return [1, 'ellipsis-left', ...middleRange, 'ellipsis-right', totalPages];
};

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  totalItems: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  /** Accessible name of the <nav>; make it unique when several paginations share a page. */
  navigationLabel?: string;
  showSummary?: boolean;
  siblingCount?: number;
  disabled?: boolean;
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>((rawProps, ref) => {
  const {
    className,
    totalItems,
    page,
    defaultPage = 1,
    onPageChange,
    pageSize,
    defaultPageSize = 10,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50],
    showPageSizeSelector = true,
    navigationLabel = 'Pagination',
    showSummary = true,
    siblingCount = 1,
    disabled = false,
    ...props
  } = rawProps;

  const isPageControlled = Object.prototype.hasOwnProperty.call(rawProps, 'page');
  const isPageSizeControlled = Object.prototype.hasOwnProperty.call(rawProps, 'pageSize');

  const [internalPage, setInternalPage] = useState(defaultPage);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);

  const resolvedTotalItems = Math.max(0, totalItems);
  const activePageSize = Math.max(1, isPageSizeControlled ? pageSize ?? defaultPageSize : internalPageSize);
  const totalPages = Math.max(1, Math.ceil(resolvedTotalItems / activePageSize));

  const unsafePage = isPageControlled ? page ?? defaultPage : internalPage;
  const currentPage = clamp(unsafePage, 1, totalPages);

  const setPage = (nextPage: number) => {
    const normalizedPage = clamp(nextPage, 1, totalPages);
    if (!isPageControlled) {
      setInternalPage(normalizedPage);
    }
    onPageChange?.(normalizedPage);
  };

  const setPageSize = (nextPageSize: number) => {
    const normalizedPageSize = Math.max(1, nextPageSize);

    if (!isPageSizeControlled) {
      setInternalPageSize(normalizedPageSize);
    }

    onPageSizeChange?.(normalizedPageSize);

    const nextTotalPages = Math.max(1, Math.ceil(resolvedTotalItems / normalizedPageSize));
    const nextPage = clamp(currentPage, 1, nextTotalPages);

    if (!isPageControlled) {
      setInternalPage(nextPage);
    }

    // Страница сообщается только если она действительно сдвинулась из-за нового размера.
    if (nextPage !== currentPage) {
      onPageChange?.(nextPage);
    }
  };

  const from = resolvedTotalItems === 0 ? 0 : (currentPage - 1) * activePageSize + 1;
  const to = resolvedTotalItems === 0 ? 0 : Math.min(resolvedTotalItems, currentPage * activePageSize);

  const pageItems = useMemo(
    () => buildPageItems(currentPage, totalPages, Math.max(0, siblingCount)),
    [currentPage, siblingCount, totalPages]
  );

  return (
    <div ref={ref} className={cn(styles.root, className)} {...props}>
      {showSummary ? (
        <p className={styles.summary}>
          Showing {from}-{to} of {resolvedTotalItems}
        </p>
      ) : null}

      <nav className={styles.navigation} aria-label={navigationLabel}>
        <Button
          type='button'
          variant='secondary'
          size='sm'
          onClick={() => setPage(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
        >
          Prev
        </Button>

        <ul className={styles.pages} role='list'>
          {pageItems.map((item, index) => {
            if (typeof item !== 'number') {
              return (
                <li key={`${item}-${index}`} className={styles.ellipsis} aria-hidden>
                  ...
                </li>
              );
            }

            const isActive = item === currentPage;
            return (
              <li key={item}>
                <Button
                  type='button'
                  variant={isActive ? 'primary' : 'secondary'}
                  size='sm'
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setPage(item)}
                  disabled={disabled}
                  className={styles.pageButton}
                >
                  {item}
                </Button>
              </li>
            );
          })}
        </ul>

        <Button
          type='button'
          variant='secondary'
          size='sm'
          onClick={() => setPage(currentPage + 1)}
          disabled={disabled || currentPage >= totalPages}
        >
          Next
        </Button>
      </nav>

      {showPageSizeSelector ? (
        <label className={styles.pageSizeLabel}>
          Rows
          <select
            className={styles.pageSizeSelect}
            value={activePageSize}
            disabled={disabled}
            onChange={(event) => setPageSize(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
});

Pagination.displayName = 'Pagination';
