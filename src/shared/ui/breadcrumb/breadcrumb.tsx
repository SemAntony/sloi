import { forwardRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './breadcrumb.module.scss';

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
};

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: BreadcrumbItem[];
  currentIndex?: number;
  defaultCurrentIndex?: number;
  onCurrentIndexChange?: (index: number) => void;
  separator?: ReactNode;
  label?: string;
}

const clampIndex = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(max, 0));

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>((rawProps, ref) => {
  const {
    className,
    items,
    currentIndex,
    defaultCurrentIndex,
    onCurrentIndexChange,
    separator = '/',
    label = 'Breadcrumb',
    ...props
  } = rawProps;
  const isControlled = Object.prototype.hasOwnProperty.call(rawProps, 'currentIndex');
    const fallbackCurrentIndex = items.length > 0 ? items.length - 1 : 0;
    const [internalCurrentIndex, setInternalCurrentIndex] = useState(
      clampIndex(defaultCurrentIndex ?? fallbackCurrentIndex, items.length - 1)
    );
    const activeCurrentIndex = clampIndex(
      isControlled ? currentIndex ?? fallbackCurrentIndex : internalCurrentIndex,
      items.length - 1
    );

    const handleActivate = (index: number) => {
      if (!isControlled) {
        setInternalCurrentIndex(index);
      }
      onCurrentIndexChange?.(index);
    };

  return (
    <nav ref={ref} aria-label={label} className={cn(styles.root, className)} {...props}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === activeCurrentIndex;

          return (
            <li key={`${index}-${item.href ?? 'item'}`} className={styles.item}>
              {isCurrent ? (
                <span className={styles.current} aria-current='page'>
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  className={styles.link}
                  href={item.href}
                  aria-disabled={item.disabled || undefined}
                  onClick={(event) => {
                    if (item.disabled) {
                      event.preventDefault();
                      return;
                    }
                    item.onClick?.(event);
                    handleActivate(index);
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type='button'
                  className={styles.link}
                  disabled={item.disabled}
                  onClick={(event) => {
                    item.onClick?.(event);
                    handleActivate(index);
                  }}
                >
                  {item.label}
                </button>
              )}

              {index < items.length - 1 ? (
                <span className={styles.separator} aria-hidden='true'>
                  {separator}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
