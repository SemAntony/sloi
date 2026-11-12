import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type RefAttributes
} from 'react';
import { Button } from '../button';
import { Pagination } from '../pagination';
import { Checkbox } from '../primitives/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger
} from '../primitives/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  type TableAlign,
  type TableDensity
} from '../table';
import { cn } from '../../lib/cn/cn';
import styles from './data-table.module.scss';

type SortDirection = 'asc' | 'desc';
type SortValue = string | number | boolean | Date | null | undefined;
type SortAccessor<T> = keyof T | ((row: T) => SortValue);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export type DataTableSortState = {
  columnId: string;
  direction: SortDirection;
};

export type DataTableSelectionKey = string;
export type DataTableColumnId = string;

export type DataTableColumnVisibility = {
  visibleColumnIds?: DataTableColumnId[];
  defaultVisibleColumnIds?: DataTableColumnId[];
  onVisibleColumnIdsChange?: (ids: DataTableColumnId[]) => void;
  nonHideableColumnIds?: DataTableColumnId[];
};

export type DataTableRowSelectionContext<T> = {
  selectedKeys: DataTableSelectionKey[];
  selectedRows: T[];
  selectedCount: number;
  clearSelection: () => void;
};

export interface DataTableRowSelection<T> {
  selectedKeys?: Array<string | number>;
  defaultSelectedKeys?: Array<string | number>;
  onSelectedKeysChange?: (selectedKeys: DataTableSelectionKey[], selectedRows: T[]) => void;
  getRowDisabled?: (row: T, index: number) => boolean;
  showSelectAll?: boolean;
  renderBulkActions?: (context: DataTableRowSelectionContext<T>) => ReactNode;
}

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  accessor?: keyof T | ((row: T) => ReactNode);
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  sortAccessor?: SortAccessor<T>;
  align?: TableAlign;
  width?: number | string;
}

interface DataTableCommonProps<T extends Record<string, unknown>>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: keyof T | ((row: T, index: number) => string | number);
  loading?: boolean;
  emptyMessage?: ReactNode;
  striped?: boolean;
  stickyHeader?: boolean;
  density?: TableDensity;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  showPageSizeSelector?: boolean;
  /** Accessible name of the pagination <nav>; make it unique when several tables share a page. */
  paginationLabel?: string;
  sort?: DataTableSortState;
  defaultSort?: DataTableSortState;
  onSortChange?: (sort: DataTableSortState | undefined) => void;
  onRowClick?: (row: T, index: number) => void;
  rowSelection?: DataTableRowSelection<T>;
  columnVisibility?: DataTableColumnVisibility;
  persistStateKey?: string;
}

type DataTableClientModeProps = {
  processingMode?: 'client';
  totalItems?: number;
};

type DataTableServerModeProps = {
  processingMode: 'server';
  totalItems: number;
};

export type DataTableProps<T extends Record<string, unknown>> = DataTableCommonProps<T> &
  (DataTableClientModeProps | DataTableServerModeProps);

const getCellContent = <T extends Record<string, unknown>>(column: DataTableColumn<T>, row: T) => {
  if (column.cell) {
    return column.cell(row);
  }

  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }

  if (column.accessor) {
    return row[column.accessor] as ReactNode;
  }

  return null;
};

const getSortValue = <T extends Record<string, unknown>>(column: DataTableColumn<T>, row: T): SortValue => {
  if (column.sortAccessor) {
    if (typeof column.sortAccessor === 'function') {
      return column.sortAccessor(row);
    }

    return row[column.sortAccessor] as SortValue;
  }

  if (typeof column.accessor === 'string') {
    return row[column.accessor] as SortValue;
  }

  if (typeof column.accessor === 'function') {
    return column.accessor(row) as SortValue;
  }

  return null;
};

const normalizeSortValue = (value: SortValue): number | string => {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  if (value == null) {
    return '';
  }

  return String(value).toLocaleLowerCase();
};

const sortIndicator = (isActive: boolean, direction: SortDirection | undefined) => {
  if (!isActive) {
    return '↕';
  }

  return direction === 'asc' ? '▲' : '▼';
};

const normalizeSelectionKeys = (keys: Array<string | number> | undefined) => {
  return Array.from(new Set((keys ?? []).map((key) => String(key))));
};

const getColumnLabel = (header: ReactNode, fallbackColumnId: string) => {
  if (typeof header === 'string' || typeof header === 'number') {
    return String(header);
  }

  return fallbackColumnId;
};

type DataTablePersistedState = {
  version: 'v1';
  sort?: DataTableSortState;
  page?: number;
  pageSize?: number;
  visibleColumnIds?: DataTableColumnId[];
};

function DataTableInner<T extends Record<string, unknown>>(
  rawProps: DataTableProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const {
    className,
    data,
    columns,
    rowKey,
    loading = false,
    emptyMessage = 'No results found.',
    striped = false,
    stickyHeader = false,
    density = 'comfortable',
    page,
    defaultPage = 1,
    onPageChange,
    pageSize,
    defaultPageSize = 10,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50],
    showPagination = true,
    showPageSizeSelector = true,
    paginationLabel,
    processingMode = 'client',
    totalItems,
    sort,
    defaultSort,
    onSortChange,
    onRowClick,
    rowSelection,
    columnVisibility,
    persistStateKey,
    ...props
  } = rawProps;

  const isSortControlled = Object.prototype.hasOwnProperty.call(rawProps, 'sort');
  const isPageControlled = Object.prototype.hasOwnProperty.call(rawProps, 'page');
  const isPageSizeControlled = Object.prototype.hasOwnProperty.call(rawProps, 'pageSize');
  const isColumnVisibilityControlled = Boolean(
    columnVisibility && Object.prototype.hasOwnProperty.call(columnVisibility, 'visibleColumnIds')
  );
  const isSelectionControlled = Boolean(
    rowSelection && Object.prototype.hasOwnProperty.call(rowSelection, 'selectedKeys')
  );
  const isServerMode = processingMode === 'server';

  const [internalSort, setInternalSort] = useState<DataTableSortState | undefined>(defaultSort);
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<DataTableSelectionKey[]>(
    normalizeSelectionKeys(rowSelection?.defaultSelectedKeys)
  );
  const [internalVisibleColumnIds, setInternalVisibleColumnIds] = useState<DataTableColumnId[]>(() => {
    const defaultVisibleIds = columnVisibility?.defaultVisibleColumnIds;
    const normalizedDefaults = Array.from(new Set((defaultVisibleIds ?? []).map((id) => String(id))));
    return normalizedDefaults.length > 0 ? normalizedDefaults : columns.map((column) => column.id);
  });
  const restoredPersistedStateRef = useRef<string | null>(null);

  const resolveRowKey = useCallback((row: T, index: number) => {
    if (typeof rowKey === 'function') {
      return String(rowKey(row, index));
    }

    return String(row[rowKey]);
  }, [rowKey]);

  const activeSort = isSortControlled ? sort : internalSort;
  const activePageSize = Math.max(1, isPageSizeControlled ? pageSize ?? defaultPageSize : internalPageSize);
  const allColumnIds = useMemo(() => columns.map((column) => column.id), [columns]);
  const allColumnIdsSet = useMemo(() => new Set(allColumnIds), [allColumnIds]);
  const nonHideableColumnIds = useMemo(
    () =>
      new Set(
        (columnVisibility?.nonHideableColumnIds ?? [])
          .map((columnId) => String(columnId))
          .filter((columnId) => allColumnIdsSet.has(columnId))
      ),
    [allColumnIdsSet, columnVisibility?.nonHideableColumnIds]
  );
  const normalizeVisibleColumnIds = useCallback((columnIds: Array<string | number> | undefined) => {
    const sourceColumnIds = (columnIds ?? allColumnIds)
      .map((columnId) => String(columnId))
      .filter((columnId) => allColumnIdsSet.has(columnId));

    const ensuredColumnIds = Array.from(
      new Set([
        ...(sourceColumnIds.length > 0 ? sourceColumnIds : allColumnIds),
        ...Array.from(nonHideableColumnIds)
      ])
    );

    if (ensuredColumnIds.length === 0) {
      return allColumnIds;
    }

    return allColumnIds.filter((columnId) => ensuredColumnIds.includes(columnId));
  }, [allColumnIds, allColumnIdsSet, nonHideableColumnIds]);
  const activeVisibleColumnIdsRaw = isColumnVisibilityControlled
    ? columnVisibility?.visibleColumnIds
    : internalVisibleColumnIds;
  const activeVisibleColumnIds = useMemo(
    () => normalizeVisibleColumnIds(activeVisibleColumnIdsRaw),
    [activeVisibleColumnIdsRaw, normalizeVisibleColumnIds]
  );
  const visibleColumnIdsSet = useMemo(() => new Set(activeVisibleColumnIds), [activeVisibleColumnIds]);
  const visibleColumns = useMemo(
    () => columns.filter((column) => visibleColumnIdsSet.has(column.id)),
    [columns, visibleColumnIdsSet]
  );

  const sortedData = useMemo(() => {
    if (isServerMode || !activeSort) {
      return data;
    }

    const targetColumn = visibleColumns.find((column) => column.id === activeSort.columnId && column.sortable);
    if (!targetColumn) {
      return data;
    }

    const directionMultiplier = activeSort.direction === 'asc' ? 1 : -1;

    return data
      .map((row, index) => ({ row, index }))
      .sort((leftItem, rightItem) => {
        const leftValue = normalizeSortValue(getSortValue(targetColumn, leftItem.row));
        const rightValue = normalizeSortValue(getSortValue(targetColumn, rightItem.row));

        let compareResult: number;
        if (typeof leftValue === 'number' && typeof rightValue === 'number') {
          compareResult = leftValue - rightValue;
        } else {
          compareResult = String(leftValue).localeCompare(String(rightValue), undefined, {
            numeric: true,
            sensitivity: 'base'
          });
        }

        if (compareResult === 0) {
          return leftItem.index - rightItem.index;
        }

        return compareResult * directionMultiplier;
      })
      .map((item) => item.row);
  }, [activeSort, data, isServerMode, visibleColumns]);

  const resolvedTotalItems = isServerMode ? Math.max(0, totalItems ?? data.length) : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(resolvedTotalItems / activePageSize));
  const unsafePage = isPageControlled ? page ?? defaultPage : internalPage;
  const currentPage = clamp(unsafePage, 1, totalPages);

  const displayData = useMemo(() => {
    if (isServerMode || !showPagination) {
      return sortedData;
    }

    const start = (currentPage - 1) * activePageSize;
    return sortedData.slice(start, start + activePageSize);
  }, [activePageSize, currentPage, isServerMode, showPagination, sortedData]);

  useEffect(() => {
    if (!persistStateKey || typeof window === 'undefined') {
      return;
    }

    if (restoredPersistedStateRef.current === persistStateKey) {
      return;
    }

    restoredPersistedStateRef.current = persistStateKey;

    try {
      const rawState = window.localStorage.getItem(persistStateKey);
      if (!rawState) {
        return;
      }

      const parsedState = JSON.parse(rawState) as DataTablePersistedState;
      if (parsedState?.version !== 'v1') {
        return;
      }

      if (!isSortControlled && parsedState.sort) {
        setInternalSort(parsedState.sort);
      }

      if (!isPageControlled && typeof parsedState.page === 'number' && Number.isFinite(parsedState.page)) {
        setInternalPage(Math.max(1, Math.floor(parsedState.page)));
      }

      if (!isPageSizeControlled && typeof parsedState.pageSize === 'number' && Number.isFinite(parsedState.pageSize)) {
        setInternalPageSize(Math.max(1, Math.floor(parsedState.pageSize)));
      }

      if (!isColumnVisibilityControlled && columnVisibility) {
        setInternalVisibleColumnIds(normalizeVisibleColumnIds(parsedState.visibleColumnIds));
      }
    } catch {
      // Ignore malformed persisted state and fall back to default runtime state.
    }
  }, [
    columnVisibility,
    isColumnVisibilityControlled,
    isPageControlled,
    isPageSizeControlled,
    isSortControlled,
    normalizeVisibleColumnIds,
    persistStateKey
  ]);

  useEffect(() => {
    if (!persistStateKey || typeof window === 'undefined') {
      return;
    }

    const persistedState: DataTablePersistedState = {
      version: 'v1',
      sort: activeSort ?? undefined,
      page: currentPage,
      pageSize: activePageSize,
      visibleColumnIds: columnVisibility ? activeVisibleColumnIds : undefined
    };

    try {
      window.localStorage.setItem(persistStateKey, JSON.stringify(persistedState));
    } catch {
      // Ignore persistence failures (private mode, quota, unavailable storage).
    }
  }, [activePageSize, activeSort, activeVisibleColumnIds, columnVisibility, currentPage, persistStateKey]);

  const selectionRows = useMemo(() => {
    const rowsForSelection = isServerMode ? data : sortedData;
    return rowsForSelection.map((row, index) => {
      const rowIndex = isServerMode ? (currentPage - 1) * activePageSize + index : index;
      return { key: resolveRowKey(row, rowIndex), row, rowIndex };
    });
  }, [activePageSize, currentPage, data, isServerMode, resolveRowKey, sortedData]);

  const knownSelectionKeySet = useMemo(() => new Set(selectionRows.map((item) => item.key)), [selectionRows]);

  const activeSelectedKeysRaw = isSelectionControlled
    ? normalizeSelectionKeys(rowSelection?.selectedKeys)
    : internalSelectedKeys;

  const activeSelectedKeys = useMemo(() => {
    return activeSelectedKeysRaw.filter((key) => knownSelectionKeySet.has(key));
  }, [activeSelectedKeysRaw, knownSelectionKeySet]);

  const selectedKeysSet = useMemo(() => new Set(activeSelectedKeys), [activeSelectedKeys]);

  const selectedRows = useMemo(() => {
    return selectionRows.filter((item) => selectedKeysSet.has(item.key)).map((item) => item.row);
  }, [selectedKeysSet, selectionRows]);

  const selectedCount = activeSelectedKeys.length;

  const commitSelectedKeys = (nextSelectedKeys: Array<string | number>) => {
    const normalizedKeys = normalizeSelectionKeys(nextSelectedKeys).filter((key) => knownSelectionKeySet.has(key));
    if (!isSelectionControlled) {
      setInternalSelectedKeys(normalizedKeys);
    }
    if (rowSelection?.onSelectedKeysChange) {
      const selectedKeySet = new Set(normalizedKeys);
      const nextSelectedRows = selectionRows
        .filter((item) => selectedKeySet.has(item.key))
        .map((item) => item.row);
      rowSelection.onSelectedKeysChange(normalizedKeys, nextSelectedRows);
    }
  };

  const displayRows = useMemo(() => {
    return displayData.map((row, index) => {
      const rowIndex = (currentPage - 1) * activePageSize + index;
      return {
        key: resolveRowKey(row, rowIndex),
        row,
        rowIndex,
        disabled: rowSelection?.getRowDisabled?.(row, rowIndex) ?? false
      };
    });
  }, [activePageSize, currentPage, displayData, resolveRowKey, rowSelection]);

  const selectableDisplayKeys = useMemo(() => {
    return displayRows.filter((item) => !item.disabled).map((item) => item.key);
  }, [displayRows]);

  const areAllDisplayRowsSelected =
    selectableDisplayKeys.length > 0 && selectableDisplayKeys.every((key) => selectedKeysSet.has(key));

  const hasSomeDisplayRowsSelected =
    selectableDisplayKeys.some((key) => selectedKeysSet.has(key)) && !areAllDisplayRowsSelected;

  const handleSelectAllChange = (nextChecked: boolean | 'indeterminate') => {
    if (nextChecked === true) {
      commitSelectedKeys([...activeSelectedKeys, ...selectableDisplayKeys]);
      return;
    }

    const selectableKeysSet = new Set(selectableDisplayKeys);
    commitSelectedKeys(activeSelectedKeys.filter((key) => !selectableKeysSet.has(key)));
  };

  const handleRowSelectionChange = (rowSelectionKey: DataTableSelectionKey, nextChecked: boolean | 'indeterminate') => {
    if (nextChecked === true) {
      commitSelectedKeys([...activeSelectedKeys, rowSelectionKey]);
      return;
    }

    commitSelectedKeys(activeSelectedKeys.filter((key) => key !== rowSelectionKey));
  };

  const clearSelection = () => {
    commitSelectedKeys([]);
  };

  const rowSelectionContext: DataTableRowSelectionContext<T> = {
    selectedKeys: activeSelectedKeys,
    selectedRows,
    selectedCount,
    clearSelection
  };

  const renderedColumnCount = visibleColumns.length + (rowSelection ? 1 : 0);

  const commitSort = (nextSort: DataTableSortState | undefined) => {
    if (!isSortControlled) {
      setInternalSort(nextSort);
    }
    onSortChange?.(nextSort);
  };

  const handleSortClick = (columnId: string) => {
    const isCurrent = activeSort?.columnId === columnId;

    if (!isCurrent) {
      commitSort({ columnId, direction: 'asc' });
      return;
    }

    if (activeSort?.direction === 'asc') {
      commitSort({ columnId, direction: 'desc' });
      return;
    }

    commitSort(undefined);
  };

  const handlePageChange = (nextPage: number) => {
    if (!isPageControlled) {
      setInternalPage(nextPage);
    }

    onPageChange?.(nextPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    const normalizedPageSize = Math.max(1, nextPageSize);

    if (!isPageSizeControlled) {
      setInternalPageSize(normalizedPageSize);
    }

    onPageSizeChange?.(normalizedPageSize);
  };

  const commitVisibleColumnIds = (nextVisibleColumnIds: Array<string | number>) => {
    const normalizedIds = normalizeVisibleColumnIds(nextVisibleColumnIds);

    if (!isColumnVisibilityControlled) {
      setInternalVisibleColumnIds(normalizedIds);
    }

    columnVisibility?.onVisibleColumnIdsChange?.(normalizedIds);

    if (activeSort && !normalizedIds.includes(activeSort.columnId)) {
      if (!isSortControlled) {
        setInternalSort(undefined);
      }
      onSortChange?.(undefined);
    }
  };

  const handleColumnVisibilityChange = (columnId: string, nextChecked: boolean | 'indeterminate') => {
    if (nextChecked === true) {
      commitVisibleColumnIds([...activeVisibleColumnIds, columnId]);
      return;
    }

    const nextVisibleColumnIds = activeVisibleColumnIds.filter((id) => id !== columnId);
    if (nextVisibleColumnIds.length === 0) {
      return;
    }

    commitVisibleColumnIds(nextVisibleColumnIds);
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T, index: number) => {
    if (!onRowClick) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick(row, index);
    }
  };

  return (
    <div ref={ref} className={cn(styles.root, className)} {...props}>
      {rowSelection && selectedCount > 0 ? (
        <div className={styles.bulkActions} role='status' aria-live='polite'>
          <span className={styles.bulkMeta}>
            {selectedCount} selected
          </span>
          <div className={styles.bulkControls}>
            {rowSelection.renderBulkActions?.(rowSelectionContext)}
            <Button size='sm' variant='ghost' onClick={clearSelection}>
              Clear selection
            </Button>
          </div>
        </div>
      ) : null}

      {columnVisibility ? (
        <div className={styles.tableHeader}>
          <Popover>
            <PopoverTrigger asChild>
              <Button type='button' variant='secondary' size='sm'>
                Columns
              </Button>
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent className={styles.columnsPopover} align='end'>
                <fieldset className={styles.columnsFieldset}>
                  <legend className={styles.columnsLegend}>Visible columns</legend>
                  {columns.map((column) => {
                    const checked = activeVisibleColumnIds.includes(column.id);
                    const isNonHideable = nonHideableColumnIds.has(column.id);
                    const isLastVisibleColumn = activeVisibleColumnIds.length === 1 && checked;
                    const isDisabled = isNonHideable || isLastVisibleColumn;
                    const label = getColumnLabel(column.header, column.id);

                    return (
                      <label key={column.id} className={styles.columnOption}>
                        <Checkbox
                          checked={checked}
                          disabled={isDisabled}
                          onCheckedChange={(nextChecked) =>
                            handleColumnVisibilityChange(column.id, nextChecked)
                          }
                          aria-label={`Toggle column ${label}`}
                        />
                        <span>{column.header}</span>
                      </label>
                    );
                  })}
                </fieldset>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>
      ) : null}

      <Table striped={striped} stickyHeader={stickyHeader} density={density}>
        <TableHead>
          <TableRow>
            {rowSelection ? (
              <TableHeaderCell className={styles.selectionHeader} align='center'>
                {rowSelection.showSelectAll !== false ? (
                  <Checkbox
                    aria-label='Select all rows on page'
                    checked={areAllDisplayRowsSelected ? true : hasSomeDisplayRowsSelected ? 'indeterminate' : false}
                    onCheckedChange={handleSelectAllChange}
                    disabled={loading || selectableDisplayKeys.length === 0}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  />
                ) : null}
              </TableHeaderCell>
            ) : null}

            {visibleColumns.map((column) => {
              const isSorted = activeSort?.columnId === column.id;
              const direction = isSorted ? activeSort?.direction : undefined;

              return (
                <TableHeaderCell
                  key={column.id}
                  align={column.align}
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={
                    column.sortable
                      ? isSorted
                        ? direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                >
                  {column.sortable ? (
                    <button
                      type='button'
                      className={cn(styles.sortButton, isSorted && styles.sortButtonActive)}
                      onClick={() => handleSortClick(column.id)}
                    >
                      <span>{column.header}</span>
                      <span className={styles.sortIndicator} aria-hidden>
                        {sortIndicator(isSorted, direction)}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHeaderCell>
              );
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell className={styles.stateCell} colSpan={renderedColumnCount}>
                Loading data...
              </TableCell>
            </TableRow>
          ) : null}

          {!loading && displayData.length === 0 ? (
            <TableRow>
              <TableCell className={styles.stateCell} colSpan={renderedColumnCount}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : null}

          {!loading
            ? displayRows.map(({ key, row, rowIndex, disabled }) => {
                const isInteractive = Boolean(onRowClick);
                const isSelected = selectedKeysSet.has(key);

                return (
                  <TableRow
                    key={key}
                    className={cn(isInteractive && styles.clickableRow, isSelected && styles.selectedRow)}
                    onClick={isInteractive ? () => onRowClick?.(row, rowIndex) : undefined}
                    onKeyDown={(event) => handleRowKeyDown(event, row, rowIndex)}
                    tabIndex={isInteractive ? 0 : undefined}
                  >
                    {rowSelection ? (
                      <TableCell className={styles.selectionCell} align='center'>
                        <Checkbox
                          aria-label={`Select row ${key}`}
                          checked={isSelected}
                          disabled={disabled}
                          onCheckedChange={(nextChecked) => handleRowSelectionChange(key, nextChecked)}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => event.stopPropagation()}
                        />
                      </TableCell>
                    ) : null}

                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {getCellContent(column, row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>

      {showPagination ? (
        <Pagination
          totalItems={resolvedTotalItems}
          page={currentPage}
          onPageChange={handlePageChange}
          pageSize={activePageSize}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
          showPageSizeSelector={showPageSizeSelector}
          navigationLabel={paginationLabel}
        />
      ) : null}
    </div>
  );
}

type DataTableComponent = <T extends Record<string, unknown>>(
  props: DataTableProps<T> & RefAttributes<HTMLDivElement>
) => ReactElement;

const DataTableBase = forwardRef(DataTableInner);
DataTableBase.displayName = 'DataTable';

export const DataTable = DataTableBase as DataTableComponent;
