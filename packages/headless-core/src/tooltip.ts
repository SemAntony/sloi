import { useCallback } from 'react';
import { useControllableState } from './use-controllable-state';

export type TooltipControllerOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
};

export type TooltipController = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delayDuration: number;
  skipDelayDuration: number | undefined;
  disableHoverableContent: boolean | undefined;
  isControlled: boolean;
};

export const useTooltipController = ({
  open,
  defaultOpen,
  onOpenChange,
  delayDuration = 250,
  skipDelayDuration,
  disableHoverableContent
}: TooltipControllerOptions = {}): TooltipController => {
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
    delayDuration,
    skipDelayDuration,
    disableHoverableContent,
    isControlled
  };
};
