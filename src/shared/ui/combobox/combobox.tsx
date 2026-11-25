import {
  forwardRef,
  useId,
  useRef,
  type InputHTMLAttributes,
} from 'react';
import { useComboboxController } from '@sloi/headless-core';
import { Button } from '../button';
import { Icon, IconX } from '../icon';
import { Input } from '../input';
import { Popover, PopoverAnchor, PopoverContent, PopoverPortal } from '../primitives/popover';
import { cn } from '../../lib/cn/cn';
import styles from './combobox.module.scss';

// Объявлен локально (структурно совпадает с типом из headless-core),
// чтобы публичные d.ts не ссылались на непубликуемый @sloi/headless-core.
export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: string[];
};

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
  const controlRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn(styles.root, className)}>
      <Popover open={controller.open} onOpenChange={controller.setOpen}>
        <PopoverAnchor asChild>
          <div ref={controlRef} className={styles.control}>
            <Input
              {...props}
              ref={ref}
              role='combobox'
              aria-haspopup='listbox'
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
                <Icon size='sm' icon={IconX} />
              </Button>
            ) : null}
          </div>
        </PopoverAnchor>

        <PopoverPortal>
          {/* Попап комбобокса это сам listbox, а не диалог: role=dialog от Radix заменён на presentation. */}
          <PopoverContent
            role='presentation'
            className={cn(styles.content, contentClassName)}
            align='start'
            onOpenAutoFocus={(event) => event.preventDefault()}
            // Input это якорь, а не Trigger, поэтому Radix считает фокус и клик по нему событием «снаружи»
            // и закрывает список сразу после открытия по onFocus. Для самого поля закрытие отменяем.
            onInteractOutside={(event) => {
              if (controlRef.current?.contains(event.target as Node)) {
                event.preventDefault();
              }
            }}
          >
            {/* Опции лежат прямо в listbox: промежуточные li ломали связь listbox > option. */}
            <div id={listboxId} role='listbox' className={styles.list}>
              {controller.filteredOptions.map((option, index) => (
                <button
                  key={option.value}
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
              ))}
            </div>
            {controller.filteredOptions.length === 0 ? <p className={styles.empty}>{emptyMessage}</p> : null}
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
