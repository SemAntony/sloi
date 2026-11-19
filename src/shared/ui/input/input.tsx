import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn/cn';
import { useFieldControl } from '../../lib/field/field-context';
import styles from './input.module.scss';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid = false, type = 'text', ...props }, ref) => {
    const field = useFieldControl({
      id: props.id,
      describedBy: props['aria-describedby'],
      invalid,
      disabled: props.disabled
    });

    return (
      <input
        ref={ref}
        type={type}
        className={cn(styles.input, className)}
        data-invalid={field.invalid ? '' : undefined}
        {...props}
        {...field.attributes}
        aria-invalid={field.invalid || props['aria-invalid']}
      />
    );
  }
);

Input.displayName = 'Input';
