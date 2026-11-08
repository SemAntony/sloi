import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from 'react';
import { type ComboboxOption as HeadlessComboboxOption, useComboboxController } from '@sloi/headless-core';
import { Button } from '../button';
import { Input } from '../input';
import { Popover, PopoverAnchor, PopoverContent, PopoverPortal } from '../primitives/popover';
import { cn } from '../../lib/cn/cn';
import styles from './combobox.module.scss';

export type ComboboxOption = HeadlessComboboxOption;

export interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  invalid?: boolean;
  clearable?: boolean;
  contentClassName?: string;
  inputClassName?: string;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>((rawProps, ref) => {
  const {
    className,
    options,
    value,
    defaultValue,
    onValueChange,
    searchValue,
    defaultSearchValue,
    onSearchValueChange,
    placeholder = 'Search...',
    emptyMessage = 'No options found.',
    disabled = false,
    required,
    name,
    invalid = false,
    clearable = true,
    contentClassName,
    inputClassName,
    onBlur,
    onFocus,
    onKeyDown,
    ...props
  } = rawProps;

  const controller = useComboboxController({
    options,
    value,
    defaultValue,
    onValueChange,
    searchValue,
    defaultSearchValue,
    onSearchValueChange,
    disabled
  });

  const listboxId = useId();

  return (
    <div className={cn(styles.root, className)}>
      <Popover open={controller.open} onOpenChange={controller.setOpen}>
        <PopoverAnchor asChild>
          <div className={styles.control}>
            <Input
              {...props}
              ref={ref}
              role='combobox'
              aria-controls={listboxId}
              aria-expanded={controller.open}
              aria-autocomplete='list'
              aria-activedescendant={controller.getActiveDescendantId(listboxId)}
              className={cn(styles.input, inputClassName)}
              value={controller.searchValue}
              onChange={(event) => {
                controller.commitSearchValue(event.target.value);
                controller.setOpen(true);
              }}
              onFocus={(event) => {
                if (!disabled) {
                  controller.setOpen(true);
                }
                onFocus?.(event);
              }}
              onBlur={onBlur}
              onKeyDown={(event) => controller.handleInputKeyDown(event, onKeyDown)}
              disabled={disabled}
              required={required}
              placeholder={placeholder}
              invalid={invalid}
            />

            {clearable && !disabled && (controller.searchValue || controller.selectedValue) ? (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className={styles.clearButton}
                onClick={controller.clearValue}
                aria-label='Clear value'
              >
                ×
              </Button>
            ) : null}
          </div>
        </PopoverAnchor>

        <PopoverPortal>
          <PopoverContent className={cn(styles.content, contentClassName)} align='start' onOpenAutoFocus={(event) => event.preventDefault()}>
            <ul id={listboxId} role='listbox' className={styles.list}>
              {controller.filteredOptions.length === 0 ? <p className={styles.empty}>{emptyMessage}</p> : null}

              {controller.filteredOptions.map((option, index) => (
                <li key={option.value}>
                  <button
                    id={`${listboxId}-option-${option.value}`}
                    type='button'
                    role='option'
                    aria-selected={controller.selectedValue === option.value}
                    disabled={option.disabled}
                    data-active={index === controller.activeIndex ? 'true' : 'false'}
                    data-selected={controller.selectedValue === option.value ? 'true' : 'false'}
                    className={styles.option}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => controller.selectOption(option)}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </PopoverPortal>
      </Popover>

      {name ? (
        <input type='hidden' name={name} value={controller.selectedValue ?? ''} required={required} disabled={disabled} />
      ) : null}
    </div>
  );
});

Combobox.displayName = 'Combobox';
