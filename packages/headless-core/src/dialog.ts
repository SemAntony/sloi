import { useCallback } from 'react';
import { useControllableState } from './use-controllable-state';

export type DialogControllerOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type DialogController = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isControlled: boolean;
};

export const useDialogController = ({
  open,
  defaultOpen,
  onOpenChange
}: DialogControllerOptions = {}): DialogController => {
  const [resolvedOpen, setResolvedOpen, isControlled] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setResolvedOpen(nextOpen);
    },
    [setResolvedOpen]
  );

  return {
    open: resolvedOpen,
    onOpenChange: handleOpenChange,
    isControlled
  };
};
