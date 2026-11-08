import { useCallback } from 'react';
import { useControllableState } from './use-controllable-state';

export type TabsControllerOptions = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type TabsController = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  isControlled: boolean;
};

export const useTabsController = ({
  value,
  defaultValue,
  onValueChange
}: TabsControllerOptions = {}): TabsController => {
  const [resolvedValue, setResolvedValue, isControlled] = useControllableState<string | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) {
        onValueChange?.(nextValue);
      }
    }
  });

  const handleValueChange = useCallback(
    (nextValue: string) => {
      setResolvedValue(nextValue);
    },
    [setResolvedValue]
  );

  return {
    value: resolvedValue,
    onValueChange: handleValueChange,
    isControlled
  };
};
