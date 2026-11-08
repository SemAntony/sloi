import { forwardRef, useState, type FormHTMLAttributes, type ReactNode, type SubmitEvent } from 'react';
import { Button } from '../button';
import { SearchInput } from '../search-input';
import { cn } from '../../lib/cn/cn';
import styles from './filter-bar.module.scss';

export interface FilterBarProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onChange'> {
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onReset?: () => void;
  filters?: ReactNode;
  actions?: ReactNode;
  placeholder?: string;
  searchButtonLabel?: string;
  resetButtonLabel?: string;
  showSearchButton?: boolean;
  showResetButton?: boolean;
  disabled?: boolean;
}

export const FilterBar = forwardRef<HTMLFormElement, FilterBarProps>((rawProps, ref) => {
  const {
    className,
    query,
    defaultQuery = '',
    onQueryChange,
    onSearch,
    onReset,
    filters,
    actions,
    placeholder = 'Search',
    searchButtonLabel = 'Search',
    resetButtonLabel = 'Reset',
    showSearchButton = true,
    showResetButton = true,
    disabled = false,
    onSubmit,
    ...props
  } = rawProps;

  const isControlled = Object.prototype.hasOwnProperty.call(rawProps, 'query');
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const currentQuery = isControlled ? query ?? '' : internalQuery;

  const commitQuery = (nextQuery: string) => {
    if (!isControlled) {
      setInternalQuery(nextQuery);
    }
    onQueryChange?.(nextQuery);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    onSubmit?.(event);
    if (event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    onSearch?.(currentQuery);
  };

  const handleReset = () => {
    commitQuery('');
    onReset?.();
    onSearch?.('');
  };

  return (
    <form ref={ref} className={cn(styles.root, className)} onSubmit={handleSubmit} {...props}>
      <div className={styles.searchBlock}>
        <SearchInput
          value={currentQuery}
          onValueChange={commitQuery}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.search}
        />
        {showSearchButton ? (
          <Button type='submit' variant='secondary' size='sm' disabled={disabled}>
            {searchButtonLabel}
          </Button>
        ) : null}
      </div>

      {filters ? <div className={styles.filters}>{filters}</div> : null}

      <div className={styles.actions}>
        {showResetButton ? (
          <Button type='button' variant='ghost' size='sm' onClick={handleReset} disabled={disabled}>
            {resetButtonLabel}
          </Button>
        ) : null}
        {actions}
      </div>
    </form>
  );
});

FilterBar.displayName = 'FilterBar';
