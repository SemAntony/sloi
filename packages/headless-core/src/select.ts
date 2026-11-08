import { useCallback } from 'react';
import { useControllableState } from './use-controllable-state';

export type SelectControllerOptions = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type SelectController = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isValueControlled: boolean;
  isOpenControlled: boolean;
};

export const useSelectController = ({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange
}: SelectControllerOptions = {}): SelectController => {
  const [resolvedValue, setResolvedValue, isValueControlled] = useControllableState<
    string | undefined
  >({
    prop: value,
    defaultProp: defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) {
        onValueChange?.(nextValue);
      }
    }
  });

  const [resolvedOpen, setResolvedOpen, isOpenControlled] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange
  });

  const handleValueChange = useCallback(
    (nextValue: string) => {
      setResolvedValue(nextValue);
    },
    [setResolvedValue]
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setResolvedOpen(nextOpen);
    },
    [setResolvedOpen]
  );

  return {
    value: resolvedValue,
    onValueChange: handleValueChange,
    open: resolvedOpen,
    onOpenChange: handleOpenChange,
    isValueControlled,
    isOpenControlled
  };
};
