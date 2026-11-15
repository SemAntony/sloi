import { createContext, useContext } from 'react';

export interface FieldContextValue {
  /** id управляемого элемента: на него указывает `htmlFor` у label. */
  id: string;
  /** id hint/error через пробел для `aria-describedby`. */
  describedBy?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

interface FieldControlOptions {
  id?: string;
  describedBy?: string;
  invalid?: boolean;
  disabled?: boolean;
}

/**
 * Для полей ввода и триггеров: берёт id, описание, invalid/required/disabled из ближайшего `Field`.
 * Вне `Field` ничего не добавляет. `aria-describedby` склеивается с явным, `id` задаёт Field
 * (свой id задавайте через `<Field id>`, а не на поле).
 * Атрибуты из `attributes` ставятся на нативный элемент после `{...props}`.
 */
export function useFieldControl({ id, describedBy, invalid = false, disabled = false }: FieldControlOptions = {}) {
  const field = useContext(FieldContext);
  // id принадлежит Field: иначе label (`htmlFor`) перестал бы указывать на поле
  const resolvedId = field?.id ?? id;
  const resolvedDescribedBy = [describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined;

  return {
    invalid: invalid || (field?.invalid ?? false),
    disabled: disabled || (field?.disabled ?? false),
    attributes: {
      ...(resolvedId ? { id: resolvedId } : {}),
      ...(resolvedDescribedBy ? { 'aria-describedby': resolvedDescribedBy } : {}),
      ...(field?.required ? { 'aria-required': true as const } : {}),
      ...(field?.disabled ? { disabled: true as const } : {})
    }
  };
}
