import {
  forwardRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes
} from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './phone-field.module.scss';

export type PhoneFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  invalid?: boolean;
};

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>((rawProps, ref) => {
  const {
    className,
    value,
    defaultValue = '',
    onValueChange,
    onChange,
    invalid = false,
    placeholder = '+1 (555) 123-4567',
    autoComplete = 'tel',
    ...props
  } = rawProps;
  const isControlled = Object.prototype.hasOwnProperty.call(rawProps, 'value');
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value ?? '' : internalValue;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      onChange?.(event);
    };

    return (
      <input
        ref={ref}
        type='tel'
        inputMode='tel'
        autoComplete={autoComplete}
        value={currentValue}
        placeholder={placeholder}
        className={cn(styles.phoneField, className)}
        aria-invalid={invalid || props['aria-invalid']}
        data-invalid={invalid ? '' : undefined}
        onChange={handleChange}
        {...props}
      />
    );
  });

PhoneField.displayName = 'PhoneField';
