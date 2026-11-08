import { forwardRef, type HTMLAttributes, type TableHTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './table.module.scss';

export type TableDensity = 'comfortable' | 'compact';
export type TableAlign = 'left' | 'center' | 'right';

const alignClassMap: Record<TableAlign, string> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight
};

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  striped?: boolean;
  stickyHeader?: boolean;
  density?: TableDensity;
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      striped = false,
      stickyHeader = false,
      density = 'comfortable',
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        styles.container,
        striped && styles.striped,
        stickyHeader && styles.stickyHeader,
        density === 'compact' && styles.compact,
        containerClassName
      )}
    >
      <table ref={ref} className={cn(styles.table, className)} {...props} />
    </div>
  )
);

export const TableHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn(styles.head, className)} {...props} />
);

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn(styles.body, className)} {...props} />
);

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => <tr ref={ref} className={cn(styles.row, className)} {...props} />
);

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ className, align = 'left', ...props }, ref) => (
    <th ref={ref} className={cn(styles.headerCell, alignClassMap[align], className)} {...props} />
  )
);

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = 'left', ...props }, ref) => (
    <td ref={ref} className={cn(styles.cell, alignClassMap[align], className)} {...props} />
  )
);

Table.displayName = 'Table';
TableHead.displayName = 'TableHead';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHeaderCell.displayName = 'TableHeaderCell';
TableCell.displayName = 'TableCell';
