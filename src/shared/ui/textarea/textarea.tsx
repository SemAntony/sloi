import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn/cn';
import { useFieldControl } from '../../lib/field/field-context';
import styles from './textarea.module.scss';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid = false, rows = 4, ...props }, ref) => {
    const field = useFieldControl({
      id: props.id,
      describedBy: props['aria-describedby'],
      invalid,
      disabled: props.disabled
    });

    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(styles.textarea, className)}
        aria-invalid={field.invalid || props['aria-invalid']}
        data-invalid={field.invalid ? '' : undefined}
        {...props}
        {...field.attributes}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
