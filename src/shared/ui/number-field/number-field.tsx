import {
  forwardRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes
} from 'react';
import { cn } from '../../lib/cn/cn';
import { useFieldControl } from '../../lib/field/field-context';
import styles from './number-field.module.scss';

function decimalPlaces(value: number): number {
  const [mantissa, exponent] = String(value).split('e-');
  const fraction = mantissa.split('.')[1]?.length ?? 0;
  return fraction + (exponent ? Number(exponent) : 0);
}

/** Убирает float-ошибку шага: 0.2 + 0.1 = 0.30000000000000004 → 0.3. */
function roundToPrecision(result: number, start: number, step: number): number {
  const places = Math.min(Math.max(decimalPlaces(start), decimalPlaces(step)), 20);
  return Number(result.toFixed(places));
}

export type NumberFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number | undefined) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  invalid?: boolean;
  showStepper?: boolean;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>((rawProps, ref) => {
  const {
    className,
    value,
    defaultValue,
    onValueChange,
    onChange,
    invalid: invalidProp = false,
    disabled: disabledProp = false,
    showStepper = true,
    min,
    max,
    step = 1,
    ...props
  } = rawProps;
  const isControlled = Object.prototype.hasOwnProperty.call(rawProps, 'value');
    const field = useFieldControl({
      id: props.id,
      describedBy: props['aria-describedby'],
      invalid: invalidProp,
      disabled: disabledProp
    });
    const invalid = field.invalid;
    const disabled = field.disabled;
    const [internalValue, setInternalValue] = useState<number | undefined>(defaultValue);
    const currentValue = isControlled ? value : internalValue;
    const numericStep = typeof step === 'number' ? step : Number(step) || 1;

    const applyValue = (nextValue: number | undefined) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    };

    const clampValue = (nextValue: number) => {
      const minNumber = typeof min === 'number' ? min : undefined;
      const maxNumber = typeof max === 'number' ? max : undefined;
      if (minNumber !== undefined && nextValue < minNumber) {
        return minNumber;
      }
      if (maxNumber !== undefined && nextValue > maxNumber) {
        return maxNumber;
      }
      return nextValue;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;
      if (rawValue === '') {
        applyValue(undefined);
        onChange?.(event);
        return;
      }

      const nextValue = Number(rawValue);
      if (Number.isNaN(nextValue)) {
        onChange?.(event);
        return;
      }

      applyValue(clampValue(nextValue));
      onChange?.(event);
    };

    const handleStep = (direction: 1 | -1) => {
      if (disabled) {
        return;
      }
      const startValue =
        currentValue ?? (typeof min === 'number' ? min : direction > 0 ? 0 : numericStep);
      const nextValue = clampValue(roundToPrecision(startValue + numericStep * direction, startValue, numericStep));
      applyValue(nextValue);
    };

    return (
      <div className={cn(styles.root, className)} data-invalid={invalid ? '' : undefined}>
        <input
          ref={ref}
          type='number'
          value={currentValue ?? ''}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={styles.input}
          onChange={handleChange}
          {...props}
          {...field.attributes}
          aria-invalid={invalid || props['aria-invalid']}
        />
        {showStepper ? (
          <div className={styles.stepper}>
            <button
              type='button'
              className={styles.stepButton}
              aria-label='Decrease value'
              onClick={() => handleStep(-1)}
              disabled={disabled}
            >
              -
            </button>
            <button
              type='button'
              className={styles.stepButton}
              aria-label='Increase value'
              onClick={() => handleStep(1)}
              disabled={disabled}
            >
              +
            </button>
          </div>
        ) : null}
      </div>
    );
  });

NumberField.displayName = 'NumberField';
