import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './input.module.scss';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid = false, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(styles.input, className)}
      aria-invalid={invalid || props['aria-invalid']}
      data-invalid={invalid ? '' : undefined}
      {...props}
    />
  )
);

Input.displayName = 'Input';
