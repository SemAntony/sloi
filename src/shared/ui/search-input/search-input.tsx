import {
  forwardRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent
} from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './search-input.module.scss';

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  invalid?: boolean;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((rawProps, ref) => {
  const {
    className,
    value,
    defaultValue = '',
    onValueChange,
    onChange,
    onClear,
    placeholder = 'Search',
    invalid = false,
    disabled = false,
    ...props
  } = rawProps;
  const isControlled = Object.prototype.hasOwnProperty.call(rawProps, 'value');
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value ?? '' : internalValue;

    const commit = (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      commit(event.target.value);
      onChange?.(event);
    };

    const handleClear = () => {
      commit('');
      onClear?.();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape' && currentValue) {
        handleClear();
      }
      props.onKeyDown?.(event);
    };

    return (
      <div className={cn(styles.root, className)} data-invalid={invalid ? '' : undefined}>
        <input
          ref={ref}
          type='search'
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          aria-invalid={invalid || props['aria-invalid']}
          {...props}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type='button'
          aria-label='Clear search'
          className={styles.clearButton}
          onClick={handleClear}
          disabled={disabled || !currentValue}
        >
          x
        </button>
      </div>
    );
  });

SearchInput.displayName = 'SearchInput';
