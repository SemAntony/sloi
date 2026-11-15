import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn/cn';
import { FieldContext } from '../../lib/field/field-context';
import { FieldMessage } from '../field-message';
import { Label } from '../primitives/label';
import styles from './field.module.scss';

export type FieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Подпись; связывается с полем через `htmlFor`. */
  label?: ReactNode;
  /** Подсказка под полем; попадает в `aria-describedby`. */
  hint?: ReactNode;
  /** Текст ошибки: включает invalid-состояние и попадает в `aria-describedby`. */
  error?: ReactNode;
  /** Invalid без текста ошибки (например, текст показывается отдельно). */
  invalid?: boolean;
  /** Звёздочка у подписи и `aria-required` у поля. */
  required?: boolean;
  disabled?: boolean;
  /** id поля (и база для id hint/error); по умолчанию генерируется. Не задавайте id на самом поле. */
  id?: string;
  /** Одно поле: Input, Textarea, PhoneField, SearchInput, NumberField или SelectTrigger. */
  children: ReactNode;
};

const hasContent = (node: ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    { label, hint, error, invalid = false, required = false, disabled = false, id, className, children, ...props },
    ref
  ) => {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const hintId = `${controlId}-hint`;
    const errorId = `${controlId}-error`;
    const showHint = hasContent(hint);
    const showError = hasContent(error);
    const isInvalid = invalid || showError;
    const describedBy = [showHint ? hintId : null, showError ? errorId : null].filter(Boolean).join(' ') || undefined;

    return (
      <div
        ref={ref}
        className={cn(styles.field, className)}
        data-invalid={isInvalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        {hasContent(label) && (
          <Label htmlFor={controlId} className={styles.label}>
            {label}
            {required && (
              <span aria-hidden='true' className={styles.required}>
                *
              </span>
            )}
          </Label>
        )}
        <FieldContext.Provider
          value={{ id: controlId, describedBy, invalid: isInvalid, required, disabled }}
        >
          {children}
        </FieldContext.Provider>
        {showHint && <FieldMessage id={hintId}>{hint}</FieldMessage>}
        {showError && (
          <FieldMessage id={errorId} tone='error'>
            {error}
          </FieldMessage>
        )}
      </div>
    );
  }
);

Field.displayName = 'Field';
