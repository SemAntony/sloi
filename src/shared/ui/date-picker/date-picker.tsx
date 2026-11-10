import { DayPicker, type Matcher } from 'react-day-picker';
import { forwardRef, useMemo, useState, type InputHTMLAttributes } from 'react';
import { Button } from '../button';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger
} from '../primitives/popover';
import { cn } from '../../lib/cn/cn';
import styles from './date-picker.module.scss';
import 'react-day-picker/style.css';

export type DatePickerMode = 'single' | 'multiple' | 'range';
export type DatePickerSingleValue = Date | undefined;
export type DatePickerMultipleValue = Date[] | undefined;
// Структурно совпадает с DateRange из react-day-picker; объявлен локально,
// чтобы публичные d.ts не зависели от react-day-picker.
export type DatePickerDateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export type DatePickerRangeValue = DatePickerDateRange | undefined;
export type DatePickerValue =
  | DatePickerSingleValue
  | DatePickerMultipleValue
  | DatePickerRangeValue;

type DatePickerCommonProps = {
  disabled?: boolean;
  required?: boolean;
  name?: string;
  min?: Date;
  max?: Date;
  locale?: string;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  calendarClassName?: string;
};

type DatePickerSingleProps = DatePickerCommonProps & {
  mode?: 'single';
  value?: DatePickerSingleValue;
  defaultValue?: DatePickerSingleValue;
  onValueChange?: (value: DatePickerSingleValue) => void;
};

type DatePickerMultipleProps = DatePickerCommonProps & {
  mode: 'multiple';
  value?: DatePickerMultipleValue;
  defaultValue?: DatePickerMultipleValue;
  onValueChange?: (value: DatePickerMultipleValue) => void;
};

type DatePickerRangeProps = DatePickerCommonProps & {
  mode: 'range';
  value?: DatePickerRangeValue;
  defaultValue?: DatePickerRangeValue;
  onValueChange?: (value: DatePickerRangeValue) => void;
};

export type DatePickerProps = DatePickerSingleProps | DatePickerMultipleProps | DatePickerRangeProps;

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);

const buildTriggerLabel = (mode: DatePickerMode, value: DatePickerValue, locale: string, placeholder: string) => {
  if (mode === 'single') {
    const singleValue = value as DatePickerSingleValue;
    return singleValue ? formatDate(singleValue, locale) : placeholder;
  }

  if (mode === 'multiple') {
    const multipleValue = value as DatePickerMultipleValue;
    if (!multipleValue || multipleValue.length === 0) {
      return placeholder;
    }
    if (multipleValue.length === 1) {
      return formatDate(multipleValue[0], locale);
    }
    return `${multipleValue.length} dates selected`;
  }

  const rangeValue = value as DatePickerRangeValue;
  if (!rangeValue?.from && !rangeValue?.to) {
    return placeholder;
  }
  if (rangeValue?.from && rangeValue?.to) {
    return `${formatDate(rangeValue.from, locale)} - ${formatDate(rangeValue.to, locale)}`;
  }
  if (rangeValue?.from) {
    return `From ${formatDate(rangeValue.from, locale)}`;
  }
  return placeholder;
};

const HiddenInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input type='hidden' style={{ display: 'none' }} {...props} />
);

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((rawProps, ref) => {
  const {
    mode = 'single',
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    required = false,
    name,
    min,
    max,
    locale,
    placeholder = 'Pick a date',
    className,
    triggerClassName,
    contentClassName,
    calendarClassName
  } = rawProps;
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerValue>(defaultValue);
  const isControlled = Object.prototype.hasOwnProperty.call(rawProps, 'value');
  const selectedValue = (isControlled ? value : uncontrolledValue) as DatePickerValue;
  const localeCode = locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en-US');

  const disabledMatchers = useMemo<Matcher[] | undefined>(() => {
    const nextMatchers: Matcher[] = [];
    if (min) {
      nextMatchers.push({ before: min });
    }
    if (max) {
      nextMatchers.push({ after: max });
    }
    return nextMatchers.length > 0 ? nextMatchers : undefined;
  }, [max, min]);

  const startMonth = min ? new Date(min.getFullYear(), min.getMonth(), 1) : undefined;
  const endMonth = max ? new Date(max.getFullYear(), max.getMonth(), 1) : undefined;

  const commitValue = (nextValue: DatePickerValue) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    if (mode === 'single') {
      (onValueChange as DatePickerSingleProps['onValueChange'])?.(nextValue as DatePickerSingleValue);
      if (nextValue) {
        setOpen(false);
      }
      return;
    }
    if (mode === 'multiple') {
      (onValueChange as DatePickerMultipleProps['onValueChange'])?.(
        nextValue as DatePickerMultipleValue
      );
      return;
    }

    const rangeValue = nextValue as DatePickerRangeValue;
    (onValueChange as DatePickerRangeProps['onValueChange'])?.(rangeValue);
    if (rangeValue?.from && rangeValue?.to) {
      setOpen(false);
    }
  };

  const multipleValue = selectedValue as DatePickerMultipleValue;
  const rangeValue = selectedValue as DatePickerRangeValue;
  const rangeFromValue = rangeValue?.from ? toDateInputValue(rangeValue.from) : '';
  const rangeToValue = rangeValue?.to ? toDateInputValue(rangeValue.to) : '';

  return (
    <div ref={ref} className={cn(styles.root, className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='secondary'
            size='sm'
            disabled={disabled}
            className={cn(styles.trigger, triggerClassName)}
          >
            {buildTriggerLabel(mode, selectedValue, localeCode, placeholder)}
          </Button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent className={cn(styles.content, contentClassName)} align='start'>
            <DayPicker
              lang={localeCode}
              mode={mode}
              selected={selectedValue as never}
              onSelect={commitValue as never}
              disabled={disabledMatchers}
              required={required}
              startMonth={startMonth}
              endMonth={endMonth}
              className={cn(styles.calendar, calendarClassName)}
              captionLayout='dropdown'
            />
          </PopoverContent>
        </PopoverPortal>
      </Popover>

      {name && mode === 'single' ? (
        <HiddenInput
          name={name}
          value={(selectedValue as DatePickerSingleValue) ? toDateInputValue(selectedValue as Date) : ''}
          required={required}
          disabled={disabled}
        />
      ) : null}

      {name && mode === 'multiple'
        ? (multipleValue?.length
            ? multipleValue.map((date, index) => (
                <HiddenInput
                  key={`${toDateInputValue(date)}-${index}`}
                  name={`${name}[]`}
                  value={toDateInputValue(date)}
                  required={required && index === 0}
                  disabled={disabled}
                />
              ))
            : (
                <HiddenInput
                  name={`${name}[]`}
                  value=''
                  required={required}
                  disabled={disabled}
                />
              ))
        : null}

      {name && mode === 'range' ? (
        <>
          <HiddenInput
            name={`${name}[from]`}
            value={rangeFromValue}
            required={required}
            disabled={disabled}
          />
          <HiddenInput
            name={`${name}[to]`}
            value={rangeToValue}
            required={required}
            disabled={disabled}
          />
        </>
      ) : null}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
