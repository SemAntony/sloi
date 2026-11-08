import { useCallback, useState, type SetStateAction } from 'react';

export type ControllableStateOptions<T> = {
  prop?: T;
  defaultProp?: T;
  onChange?: (value: T) => void;
};

export type ControllableStateSetOptions = {
  emitChange?: boolean;
};

export type ControllableStateSetter<T> = (
  value: SetStateAction<T>,
  options?: ControllableStateSetOptions
) => void;

export type ControllableStateResult<T> = [T, ControllableStateSetter<T>, boolean];

export const useControllableState = <T>({
  prop,
  defaultProp,
  onChange
}: ControllableStateOptions<T>): ControllableStateResult<T> => {
  const isControlled = prop !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(defaultProp);

  const value = (isControlled ? prop : uncontrolledValue) as T;

  const setValue = useCallback<ControllableStateSetter<T>>(
    (nextValue, options) => {
      const currentValue = value;
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (previousState: T) => T)(currentValue)
          : nextValue;

      if (!isControlled) {
        setUncontrolledValue(resolvedValue);
      }

      if (options?.emitChange === false) {
        return;
      }

      if (!Object.is(currentValue, resolvedValue)) {
        onChange?.(resolvedValue);
      }
    },
    [isControlled, onChange, value]
  );

  return [value, setValue, isControlled];
};
