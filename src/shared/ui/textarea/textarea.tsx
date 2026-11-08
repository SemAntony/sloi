import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './textarea.module.scss';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid = false, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(styles.textarea, className)}
      aria-invalid={invalid || props['aria-invalid']}
      data-invalid={invalid ? '' : undefined}
      {...props}
    />
  )
);

Textarea.displayName = 'Textarea';
