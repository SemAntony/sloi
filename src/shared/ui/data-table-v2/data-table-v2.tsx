import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  type UIEvent
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
import styles from './data-table-v2.module.scss';

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

interface DataTableCommonProps<T extends object>
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

export type DataTableProps<T extends object> = DataTableCommonProps<T> &
  (DataTableClientModeProps | DataTableServerModeProps);

export type DataTablePinSide = 'left' | 'right';

export interface DataTableV2ColumnPinningState {
  left: DataTableColumnId[];
  right: DataTableColumnId[];
}

export interface DataTableV2PinningProps {
  enableColumnPinning?: boolean;
  pinnedColumns?: DataTableV2ColumnPinningState;
  defaultPinnedColumns?: DataTableV2ColumnPinningState;
  onPinnedColumnsChange?: (state: DataTableV2ColumnPinningState) => void;
}

export interface DataTableV2ColumnSizeState {
  [columnId: DataTableColumnId]: number;
}

export interface DataTableV2ResizeProps {
  enableColumnResize?: boolean;
  columnSizes?: DataTableV2ColumnSizeState;
  defaultColumnSizes?: DataTableV2ColumnSizeState;
  onColumnSizesChange?: (state: DataTableV2ColumnSizeState) => void;
  minColumnWidth?: number;
  maxColumnWidth?: number;
}

export interface DataTableV2VirtualizationProps {
  enableVirtualization?: boolean;
  rowHeight?: number;
  overscan?: number;
}

export type DataTableV2Props<T extends object> = DataTableProps<T> &
  DataTableV2PinningProps &
  DataTableV2ResizeProps &
  DataTableV2VirtualizationProps;

const getCellContent = <T extends object>(column: DataTableColumn<T>, row: T) => {
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

const getSortValue = <T extends object>(column: DataTableColumn<T>, row: T): SortValue => {
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

const arePinnedColumnsEqual = (
  left: DataTableV2ColumnPinningState,
  right: DataTableV2ColumnPinningState
) =>
  left.left.length === right.left.length &&
  left.right.length === right.right.length &&
  left.left.every((id, index) => id === right.left[index]) &&
  left.right.every((id, index) => id === right.right[index]);

const DEFAULT_PINNED_COLUMN_WIDTH_PX = 180;
const DEFAULT_MIN_COLUMN_WIDTH_PX = 96;
const DEFAULT_MAX_COLUMN_WIDTH_PX = 640;
const RESIZE_KEYBOARD_STEP_PX = 12;
const RESIZE_KEYBOARD_STEP_LARGE_PX = 24;
const DEFAULT_VIRTUAL_ROW_HEIGHT_PX = 44;
const DEFAULT_VIRTUAL_OVERSCAN_ROWS = 6;
const DEFAULT_VIRTUAL_VIEWPORT_HEIGHT_PX = 440;

type DataTableVirtualWindow = {
  startIndex: number;
  endIndexExclusive: number;
  topSpacerHeight: number;
  bottomSpacerHeight: number;
};

type ResolveVirtualWindowOptions = {
  totalRows: number;
  rowHeight: number;
  viewportHeight: number;
  scrollTop: number;
  overscan: number;
  forceVisibleIndex?: number;
};

const resolveVirtualWindow = (options: ResolveVirtualWindowOptions): DataTableVirtualWindow => {
  const totalRows = Math.max(0, Math.floor(options.totalRows));
  const rowHeight = Math.max(1, Math.floor(options.rowHeight));
  const viewportHeight = Math.max(rowHeight, Math.floor(options.viewportHeight));
  const overscan = Math.max(0, Math.floor(options.overscan));
  const maxScrollTop = Math.max(0, totalRows * rowHeight - viewportHeight);
  const safeScrollTop = clamp(options.scrollTop, 0, maxScrollTop);

  if (totalRows === 0) {
    return {
      startIndex: 0,
      endIndexExclusive: 0,
      topSpacerHeight: 0,
      bottomSpacerHeight: 0
    };
  }

  const visibleStart = Math.floor(safeScrollTop / rowHeight);
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  let startIndex = clamp(visibleStart - overscan, 0, totalRows);
  let endIndexExclusive = clamp(visibleStart + visibleCount + overscan, startIndex + 1, totalRows);

  if (typeof options.forceVisibleIndex === 'number') {
    const focusedIndex = clamp(Math.floor(options.forceVisibleIndex), 0, Math.max(0, totalRows - 1));
    if (focusedIndex < startIndex) {
      startIndex = focusedIndex;
    }
    if (focusedIndex >= endIndexExclusive) {
      endIndexExclusive = focusedIndex + 1;
    }
    if (endIndexExclusive > totalRows) {
      endIndexExclusive = totalRows;
    }
  }

  return {
    startIndex,
    endIndexExclusive,
    topSpacerHeight: startIndex * rowHeight,
    bottomSpacerHeight: Math.max(0, (totalRows - endIndexExclusive) * rowHeight)
  };
};

const normalizePinnedColumns = (
  state: DataTableV2ColumnPinningState | undefined,
  availableColumnIds: DataTableColumnId[]
): DataTableV2ColumnPinningState => {
  const availableSet = new Set(availableColumnIds);
  const left = Array.from(
    new Set((state?.left ?? []).map((id) => String(id)).filter((id) => availableSet.has(id)))
  );
  const right = Array.from(
    new Set(
      (state?.right ?? [])
        .map((id) => String(id))
        .filter((id) => availableSet.has(id) && !left.includes(id))
    )
  );

  return { left, right };
};

const normalizeColumnSizes = (
  state: DataTableV2ColumnSizeState | undefined,
  availableColumnIds: DataTableColumnId[],
  minWidth: number,
  maxWidth: number
): DataTableV2ColumnSizeState => {
  if (!state) {
    return {};
  }

  const availableSet = new Set(availableColumnIds);
  const normalizedEntries = Object.entries(state)
    .filter(([columnId]) => availableSet.has(columnId))
    .map(([columnId, width]) => [columnId, clamp(Number(width), minWidth, maxWidth)] as const)
    .filter(([, width]) => Number.isFinite(width));

  return Object.fromEntries(normalizedEntries);
};

const areColumnSizesEqual = (
  left: DataTableV2ColumnSizeState,
  right: DataTableV2ColumnSizeState
) => {
  const leftEntries = Object.entries(left);
  const rightEntries = Object.entries(right);
  if (leftEntries.length !== rightEntries.length) {
    return false;
  }

  return leftEntries.every(([columnId, width]) => right[columnId] === width);
};

const resolveColumnWidthPx = <T extends object>(column: DataTableColumn<T>) => {
  if (typeof column.width === 'number' && Number.isFinite(column.width) && column.width > 0) {
    return column.width;
  }

  if (typeof column.width === 'string') {
    const pxValue = Number.parseFloat(column.width);
    if (column.width.endsWith('px') && Number.isFinite(pxValue) && pxValue > 0) {
      return pxValue;
    }
  }

  return DEFAULT_PINNED_COLUMN_WIDTH_PX;
};

const getColumnPinStateLabel = (side: DataTablePinSide | 'none') => {
  if (side === 'left') {
    return 'Pinned left';
  }

  if (side === 'right') {
    return 'Pinned right';
  }

  return 'Not pinned';
};

type DataTablePersistedState = {
  version: 'v1';
  sort?: DataTableSortState;
  page?: number;
  pageSize?: number;
  visibleColumnIds?: DataTableColumnId[];
};

function DataTableInner<T extends object>(
  rawProps: DataTableV2Props<T>,
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
    processingMode = 'client',
    totalItems,
    sort,
    defaultSort,
    onSortChange,
    onRowClick,
    rowSelection,
    columnVisibility,
    persistStateKey,
    enableColumnPinning = false,
    pinnedColumns,
    defaultPinnedColumns,
    onPinnedColumnsChange,
    enableColumnResize = false,
    columnSizes,
    defaultColumnSizes,
    onColumnSizesChange,
    minColumnWidth = DEFAULT_MIN_COLUMN_WIDTH_PX,
    maxColumnWidth = DEFAULT_MAX_COLUMN_WIDTH_PX,
    enableVirtualization = false,
    rowHeight = DEFAULT_VIRTUAL_ROW_HEIGHT_PX,
    overscan = DEFAULT_VIRTUAL_OVERSCAN_ROWS,
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
  const isPinnedColumnsControlled = Object.prototype.hasOwnProperty.call(rawProps, 'pinnedColumns');
  const isColumnSizesControlled = Object.prototype.hasOwnProperty.call(rawProps, 'columnSizes');
  const isServerMode = processingMode === 'server';
  const normalizedMinColumnWidth = Math.max(48, Math.floor(minColumnWidth));
  const normalizedMaxColumnWidth = Math.max(normalizedMinColumnWidth, Math.floor(maxColumnWidth));
  const normalizedVirtualRowHeight = Math.max(24, Math.floor(rowHeight));
  const normalizedVirtualOverscan = Math.max(0, Math.floor(overscan));

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
  const [internalPinnedColumns, setInternalPinnedColumns] = useState<DataTableV2ColumnPinningState>(() =>
    normalizePinnedColumns(defaultPinnedColumns, columns.map((column) => column.id))
  );
  const [internalColumnSizes, setInternalColumnSizes] = useState<DataTableV2ColumnSizeState>(() =>
    normalizeColumnSizes(
      defaultColumnSizes,
      columns.map((column) => column.id),
      normalizedMinColumnWidth,
      normalizedMaxColumnWidth
    )
  );
  const restoredPersistedStateRef = useRef<string | null>(null);
  const activeResizeRef = useRef<{
    columnId: DataTableColumnId;
    startX: number;
    startWidth: number;
  } | null>(null);
  const resizePointerMoveListenerRef = useRef<((event: PointerEvent) => void) | null>(null);
  const resizePointerUpListenerRef = useRef<(() => void) | null>(null);
  const virtualViewportRef = useRef<HTMLDivElement | null>(null);
  const focusedVirtualRowKeyRef = useRef<DataTableSelectionKey | null>(null);
  const [virtualScrollTop, setVirtualScrollTop] = useState(0);
  const [virtualViewportHeight, setVirtualViewportHeight] = useState(DEFAULT_VIRTUAL_VIEWPORT_HEIGHT_PX);

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
  const activePinnedColumnsRaw = isPinnedColumnsControlled ? pinnedColumns : internalPinnedColumns;
  const activePinnedColumns = useMemo(
    () => normalizePinnedColumns(activePinnedColumnsRaw, allColumnIds),
    [activePinnedColumnsRaw, allColumnIds]
  );
  const activeColumnSizesRaw = isColumnSizesControlled ? columnSizes : internalColumnSizes;
  const activeColumnSizes = useMemo(
    () => normalizeColumnSizes(activeColumnSizesRaw, allColumnIds, normalizedMinColumnWidth, normalizedMaxColumnWidth),
    [activeColumnSizesRaw, allColumnIds, normalizedMaxColumnWidth, normalizedMinColumnWidth]
  );
  const columnByIdMap = useMemo(
    () => new Map(columns.map((column) => [column.id, column])),
    [columns]
  );
  const resolvedColumnWidths = useMemo(() => {
    const nextMap = new Map<DataTableColumnId, number>();
    for (const column of columns) {
      const widthOverride = activeColumnSizes[column.id];
      if (typeof widthOverride === 'number' && Number.isFinite(widthOverride)) {
        nextMap.set(column.id, clamp(widthOverride, normalizedMinColumnWidth, normalizedMaxColumnWidth));
        continue;
      }

      nextMap.set(column.id, resolveColumnWidthPx(column));
    }
    return nextMap;
  }, [activeColumnSizes, columns, normalizedMaxColumnWidth, normalizedMinColumnWidth]);
  const orderedVisibleColumns = useMemo(() => {
    if (!enableColumnPinning) {
      return visibleColumns;
    }

    const visibleMap = new Map(visibleColumns.map((column) => [column.id, column]));
    const leftPinnedColumns = activePinnedColumns.left
      .map((columnId) => visibleMap.get(columnId))
      .filter((column): column is DataTableColumn<T> => Boolean(column));
    const rightPinnedColumns = activePinnedColumns.right
      .map((columnId) => visibleMap.get(columnId))
      .filter((column): column is DataTableColumn<T> => Boolean(column));
    const pinnedColumnIds = new Set([
      ...leftPinnedColumns.map((column) => column.id),
      ...rightPinnedColumns.map((column) => column.id)
    ]);
    const middleColumns = visibleColumns.filter((column) => !pinnedColumnIds.has(column.id));

    return [...leftPinnedColumns, ...middleColumns, ...rightPinnedColumns];
  }, [activePinnedColumns.left, activePinnedColumns.right, enableColumnPinning, visibleColumns]);
  const pinnedColumnMeta = useMemo(() => {
    const meta = new Map<DataTableColumnId, { side: DataTablePinSide; offset: number }>();
    if (!enableColumnPinning) {
      return meta;
    }

    const visibleMap = new Map(orderedVisibleColumns.map((column) => [column.id, column]));
    let leftOffset = 0;
    for (const columnId of activePinnedColumns.left) {
      const column = visibleMap.get(columnId);
      if (!column) {
        continue;
      }

      meta.set(columnId, { side: 'left', offset: leftOffset });
      leftOffset += resolvedColumnWidths.get(column.id) ?? resolveColumnWidthPx(column);
    }

    let rightOffset = 0;
    for (const columnId of [...activePinnedColumns.right].reverse()) {
      const column = visibleMap.get(columnId);
      if (!column) {
        continue;
      }

      meta.set(columnId, { side: 'right', offset: rightOffset });
      rightOffset += resolvedColumnWidths.get(column.id) ?? resolveColumnWidthPx(column);
    }

    return meta;
  }, [activePinnedColumns.left, activePinnedColumns.right, enableColumnPinning, orderedVisibleColumns, resolvedColumnWidths]);

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

  const shouldVirtualizeRows = enableVirtualization && !loading && displayRows.length > 0;
  const displayRowIndexByKey = useMemo(() => {
    return new Map(displayRows.map((rowItem, index) => [rowItem.key, index]));
  }, [displayRows]);
  const focusedVirtualRowIndex = useMemo(() => {
    if (!shouldVirtualizeRows) {
      return undefined;
    }

    const focusedKey = focusedVirtualRowKeyRef.current;
    if (!focusedKey) {
      return undefined;
    }

    return displayRowIndexByKey.get(focusedKey);
  }, [displayRowIndexByKey, shouldVirtualizeRows]);
  const virtualWindow = useMemo(() => {
    if (!shouldVirtualizeRows) {
      return null;
    }

    return resolveVirtualWindow({
      totalRows: displayRows.length,
      rowHeight: normalizedVirtualRowHeight,
      viewportHeight: virtualViewportHeight,
      scrollTop: virtualScrollTop,
      overscan: normalizedVirtualOverscan,
      forceVisibleIndex: focusedVirtualRowIndex
    });
  }, [
    displayRows.length,
    focusedVirtualRowIndex,
    normalizedVirtualOverscan,
    normalizedVirtualRowHeight,
    shouldVirtualizeRows,
    virtualScrollTop,
    virtualViewportHeight
  ]);
  const visibleDisplayRows = useMemo(() => {
    if (!virtualWindow) {
      return displayRows;
    }

    return displayRows.slice(virtualWindow.startIndex, virtualWindow.endIndexExclusive);
  }, [displayRows, virtualWindow]);

  const handleVirtualViewportScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight } = event.currentTarget;
    setVirtualScrollTop(scrollTop);
    setVirtualViewportHeight(Math.max(normalizedVirtualRowHeight, clientHeight));
  };

  const handleVirtualRowFocus = (rowSelectionKey: DataTableSelectionKey) => {
    if (!shouldVirtualizeRows) {
      return;
    }

    focusedVirtualRowKeyRef.current = rowSelectionKey;
  };

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

  const renderedColumnCount = orderedVisibleColumns.length + (rowSelection ? 1 : 0);

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

  const getColumnPinSide = (columnId: DataTableColumnId): DataTablePinSide | 'none' => {
    if (activePinnedColumns.left.includes(columnId)) {
      return 'left';
    }

    if (activePinnedColumns.right.includes(columnId)) {
      return 'right';
    }

    return 'none';
  };

  const commitPinnedColumns = (nextPinnedColumns: DataTableV2ColumnPinningState) => {
    const normalizedPinnedColumns = normalizePinnedColumns(nextPinnedColumns, allColumnIds);
    if (arePinnedColumnsEqual(normalizedPinnedColumns, activePinnedColumns)) {
      return;
    }

    if (!isPinnedColumnsControlled) {
      setInternalPinnedColumns(normalizedPinnedColumns);
    }

    onPinnedColumnsChange?.(normalizedPinnedColumns);
  };

  const handlePinColumn = (columnId: DataTableColumnId, side: DataTablePinSide) => {
    const left = activePinnedColumns.left.filter((id) => id !== columnId);
    const right = activePinnedColumns.right.filter((id) => id !== columnId);

    if (side === 'left') {
      left.push(columnId);
    } else {
      right.push(columnId);
    }

    commitPinnedColumns({ left, right });
  };

  const handleUnpinColumn = (columnId: DataTableColumnId) => {
    commitPinnedColumns({
      left: activePinnedColumns.left.filter((id) => id !== columnId),
      right: activePinnedColumns.right.filter((id) => id !== columnId)
    });
  };

  const commitColumnSizes = (nextColumnSizes: DataTableV2ColumnSizeState) => {
    const normalizedSizes = normalizeColumnSizes(
      nextColumnSizes,
      allColumnIds,
      normalizedMinColumnWidth,
      normalizedMaxColumnWidth
    );
    if (areColumnSizesEqual(normalizedSizes, activeColumnSizes)) {
      return;
    }

    if (!isColumnSizesControlled) {
      setInternalColumnSizes(normalizedSizes);
    }

    onColumnSizesChange?.(normalizedSizes);
  };

  const getResolvedColumnWidth = (columnId: DataTableColumnId) => {
    const widthFromMap = resolvedColumnWidths.get(columnId);
    if (typeof widthFromMap === 'number' && Number.isFinite(widthFromMap)) {
      return widthFromMap;
    }

    const column = columnByIdMap.get(columnId);
    if (!column) {
      return normalizedMinColumnWidth;
    }

    return resolveColumnWidthPx(column);
  };

  const resizeColumnByDelta = (columnId: DataTableColumnId, delta: number) => {
    const currentWidth = getResolvedColumnWidth(columnId);
    const nextWidth = clamp(currentWidth + delta, normalizedMinColumnWidth, normalizedMaxColumnWidth);
    commitColumnSizes({
      ...activeColumnSizes,
      [columnId]: nextWidth
    });
  };

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLButtonElement>, columnId: DataTableColumnId) => {
    const regularStep = event.shiftKey ? RESIZE_KEYBOARD_STEP_LARGE_PX : RESIZE_KEYBOARD_STEP_PX;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      resizeColumnByDelta(columnId, -regularStep);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      resizeColumnByDelta(columnId, regularStep);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      event.stopPropagation();
      commitColumnSizes({
        ...activeColumnSizes,
        [columnId]: normalizedMinColumnWidth
      });
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      commitColumnSizes({
        ...activeColumnSizes,
        [columnId]: normalizedMaxColumnWidth
      });
    }
  };

  const stopResizeTracking = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (resizePointerMoveListenerRef.current) {
        window.removeEventListener('pointermove', resizePointerMoveListenerRef.current);
      }
      if (resizePointerUpListenerRef.current) {
        window.removeEventListener('pointerup', resizePointerUpListenerRef.current);
      }
    }

    resizePointerMoveListenerRef.current = null;
    resizePointerUpListenerRef.current = null;
    activeResizeRef.current = null;
  }, []);

  const handleResizePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    columnId: DataTableColumnId
  ) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    activeResizeRef.current = {
      columnId,
      startX: event.clientX,
      startWidth: getResolvedColumnWidth(columnId)
    };

    if (typeof window !== 'undefined') {
      const handlePointerMove = (nextEvent: PointerEvent) => {
        const activeResize = activeResizeRef.current;
        if (!activeResize) {
          return;
        }

        const delta = nextEvent.clientX - activeResize.startX;
        const nextWidth = clamp(activeResize.startWidth + delta, normalizedMinColumnWidth, normalizedMaxColumnWidth);
        commitColumnSizes({
          ...activeColumnSizes,
          [activeResize.columnId]: nextWidth
        });
      };

      const handlePointerUp = () => {
        stopResizeTracking();
      };

      resizePointerMoveListenerRef.current = handlePointerMove;
      resizePointerUpListenerRef.current = handlePointerUp;

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
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

  useEffect(() => {
    if (!shouldVirtualizeRows) {
      setVirtualScrollTop(0);
      setVirtualViewportHeight(DEFAULT_VIRTUAL_VIEWPORT_HEIGHT_PX);
      focusedVirtualRowKeyRef.current = null;
      return;
    }

    const viewport = virtualViewportRef.current;
    if (!viewport) {
      return;
    }

    setVirtualViewportHeight(Math.max(normalizedVirtualRowHeight, viewport.clientHeight));
  }, [normalizedVirtualRowHeight, shouldVirtualizeRows]);

  useEffect(() => {
    if (!shouldVirtualizeRows) {
      return;
    }

    const viewport = virtualViewportRef.current;
    if (!viewport) {
      return;
    }

    const maxScrollTop = Math.max(0, displayRows.length * normalizedVirtualRowHeight - viewport.clientHeight);
    if (viewport.scrollTop > maxScrollTop) {
      viewport.scrollTop = maxScrollTop;
      setVirtualScrollTop(maxScrollTop);
    }
  }, [displayRows.length, normalizedVirtualRowHeight, shouldVirtualizeRows]);

  useEffect(() => {
    if (!focusedVirtualRowKeyRef.current) {
      return;
    }

    if (displayRowIndexByKey.has(focusedVirtualRowKeyRef.current)) {
      return;
    }

    focusedVirtualRowKeyRef.current = null;
  }, [displayRowIndexByKey]);

  useEffect(() => {
    if (isPinnedColumnsControlled) {
      return;
    }

    const normalized = normalizePinnedColumns(internalPinnedColumns, allColumnIds);
    if (arePinnedColumnsEqual(normalized, internalPinnedColumns)) {
      return;
    }

    setInternalPinnedColumns(normalized);
    onPinnedColumnsChange?.(normalized);
  }, [allColumnIds, internalPinnedColumns, isPinnedColumnsControlled, onPinnedColumnsChange]);

  useEffect(() => {
    if (isColumnSizesControlled) {
      return;
    }

    const normalized = normalizeColumnSizes(
      internalColumnSizes,
      allColumnIds,
      normalizedMinColumnWidth,
      normalizedMaxColumnWidth
    );
    if (areColumnSizesEqual(normalized, internalColumnSizes)) {
      return;
    }

    setInternalColumnSizes(normalized);
    onColumnSizesChange?.(normalized);
  }, [
    allColumnIds,
    internalColumnSizes,
    isColumnSizesControlled,
    normalizedMaxColumnWidth,
    normalizedMinColumnWidth,
    onColumnSizesChange
  ]);

  useEffect(() => {
    return () => {
      stopResizeTracking();
    };
  }, [stopResizeTracking]);

  const getPinnedCellClassName = (columnId: DataTableColumnId, isHeader: boolean) => {
    if (!enableColumnPinning) {
      return undefined;
    }

    const pinnedMeta = pinnedColumnMeta.get(columnId);
    if (!pinnedMeta) {
      return undefined;
    }

    return cn(
      styles.pinnedCell,
      isHeader ? styles.pinnedHeaderCell : styles.pinnedBodyCell,
      pinnedMeta.side === 'left' ? styles.pinnedLeft : styles.pinnedRight
    );
  };

  const getColumnCellStyle = (column: DataTableColumn<T>): CSSProperties | undefined => {
    const hasResizeWidth = enableColumnResize || typeof activeColumnSizes[column.id] === 'number';
    const resolvedWidthPx = getResolvedColumnWidth(column.id);
    const baseStyle: CSSProperties = hasResizeWidth
      ? {
        width: `${resolvedWidthPx}px`,
        minWidth: `${resolvedWidthPx}px`,
        maxWidth: `${resolvedWidthPx}px`
      }
      : column.width ? { width: column.width } : {};

    const pinnedMeta = enableColumnPinning ? pinnedColumnMeta.get(column.id) : undefined;
    if (pinnedMeta) {
      baseStyle.width = hasResizeWidth ? `${resolvedWidthPx}px` : column.width ?? `${resolvedWidthPx}px`;
      baseStyle.minWidth = `${resolvedWidthPx}px`;
      baseStyle.maxWidth = `${resolvedWidthPx}px`;
      if (pinnedMeta.side === 'left') {
        baseStyle.left = `${pinnedMeta.offset}px`;
      } else {
        baseStyle.right = `${pinnedMeta.offset}px`;
      }
    }

    if (Object.keys(baseStyle).length === 0) {
      return undefined;
    }

    return baseStyle;
  };

  const tableNode = (
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

          {orderedVisibleColumns.map((column) => {
            const isSorted = activeSort?.columnId === column.id;
            const direction = isSorted ? activeSort?.direction : undefined;

            return (
              <TableHeaderCell
                key={column.id}
                align={column.align}
                className={getPinnedCellClassName(column.id, true)}
                style={getColumnCellStyle(column)}
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
                <div className={cn(styles.headerContent, enableColumnResize && styles.resizableHeader)}>
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
                    <span>{column.header}</span>
                  )}

                  {enableColumnResize ? (
                    <button
                      type='button'
                      className={styles.resizeHandle}
                      aria-label={`Resize column ${getColumnLabel(column.header, column.id)}`}
                      onPointerDown={(event) => handleResizePointerDown(event, column.id)}
                      onKeyDown={(event) => handleResizeKeyDown(event, column.id)}
                    >
                      <span className={styles.resizeGrip} aria-hidden />
                    </button>
                  ) : null}
                </div>
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

        {!loading && shouldVirtualizeRows && (virtualWindow?.topSpacerHeight ?? 0) > 0 ? (
          <TableRow aria-hidden='true'>
            <TableCell
              className={styles.virtualSpacerCell}
              colSpan={renderedColumnCount}
              style={{ height: `${virtualWindow?.topSpacerHeight ?? 0}px` }}
            />
          </TableRow>
        ) : null}

        {!loading
          ? visibleDisplayRows.map(({ key, row, rowIndex, disabled }) => {
              const isInteractive = Boolean(onRowClick);
              const isSelected = selectedKeysSet.has(key);

              return (
                <TableRow
                  key={key}
                  data-row-key={key}
                  className={cn(isInteractive && styles.clickableRow, isSelected && styles.selectedRow)}
                  onClick={isInteractive ? () => onRowClick?.(row, rowIndex) : undefined}
                  onKeyDown={(event) => handleRowKeyDown(event, row, rowIndex)}
                  onFocus={isInteractive ? () => handleVirtualRowFocus(key) : undefined}
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

                  {orderedVisibleColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      className={getPinnedCellClassName(column.id, false)}
                      style={getColumnCellStyle(column)}
                    >
                      {getCellContent(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          : null}

        {!loading && shouldVirtualizeRows && (virtualWindow?.bottomSpacerHeight ?? 0) > 0 ? (
          <TableRow aria-hidden='true'>
            <TableCell
              className={styles.virtualSpacerCell}
              colSpan={renderedColumnCount}
              style={{ height: `${virtualWindow?.bottomSpacerHeight ?? 0}px` }}
            />
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  );

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

      {columnVisibility || enableColumnPinning ? (
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderControls}>
            {enableColumnPinning ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button type='button' variant='secondary' size='sm'>
                    Pin columns
                  </Button>
                </PopoverTrigger>
                <PopoverPortal>
                  <PopoverContent className={styles.pinningPopover} align='end' aria-label='Column pinning controls'>
                    <fieldset className={styles.columnsFieldset}>
                      <legend className={styles.pinningLegend}>Column pinning</legend>
                      <div className={styles.pinningList}>
                        {orderedVisibleColumns.map((column) => {
                          const pinSide = getColumnPinSide(column.id);
                          const label = getColumnLabel(column.header, column.id);

                          return (
                            <div key={column.id} className={styles.pinningRow}>
                              <div className={styles.pinningRowHeader}>
                                <span className={styles.pinningLabel}>{column.header}</span>
                                <span className={styles.pinningState}>{getColumnPinStateLabel(pinSide)}</span>
                              </div>
                              <div className={styles.pinningActions}>
                                <Button
                                  type='button'
                                  size='sm'
                                  variant='secondary'
                                  disabled={pinSide === 'left'}
                                  onClick={() => handlePinColumn(column.id, 'left')}
                                  aria-label={`Pin column ${label} left`}
                                >
                                  Pin left
                                </Button>
                                <Button
                                  type='button'
                                  size='sm'
                                  variant='secondary'
                                  disabled={pinSide === 'right'}
                                  onClick={() => handlePinColumn(column.id, 'right')}
                                  aria-label={`Pin column ${label} right`}
                                >
                                  Pin right
                                </Button>
                                <Button
                                  type='button'
                                  size='sm'
                                  variant='ghost'
                                  disabled={pinSide === 'none'}
                                  onClick={() => handleUnpinColumn(column.id)}
                                  aria-label={`Unpin column ${label}`}
                                >
                                  Unpin
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </fieldset>
                  </PopoverContent>
                </PopoverPortal>
              </Popover>
            ) : null}

            {columnVisibility ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button type='button' variant='secondary' size='sm'>
                    Columns
                  </Button>
                </PopoverTrigger>
                <PopoverPortal>
                  <PopoverContent className={styles.columnsPopover} align='end' aria-label='Column visibility controls'>
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
            ) : null}
          </div>
        </div>
      ) : null}

      {shouldVirtualizeRows ? (
        <div
          ref={virtualViewportRef}
          className={styles.virtualViewport}
          aria-label='DataTable virtualized viewport'
          onScroll={handleVirtualViewportScroll}
        >
          {tableNode}
        </div>
      ) : (
        tableNode
      )}

      {showPagination ? (
        <Pagination
          totalItems={resolvedTotalItems}
          page={currentPage}
          onPageChange={handlePageChange}
          pageSize={activePageSize}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
          showPageSizeSelector={showPageSizeSelector}
        />
      ) : null}
    </div>
  );
}

type DataTableV2Component = <T extends object>(
  props: DataTableV2Props<T> & RefAttributes<HTMLDivElement>
) => ReactElement;

const DataTableV2Base = forwardRef(DataTableInner);
DataTableV2Base.displayName = 'DataTableV2';

export const DataTableV2 = DataTableV2Base as DataTableV2Component;
