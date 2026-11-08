import { Tooltip as TooltipPrimitive } from 'radix-ui';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
  type ReactNode
} from 'react';
import { useTooltipController } from '@sloi/headless-core';
import { cn } from '../../lib/cn/cn';
import styles from './tooltip.module.scss';

type TooltipPrimitiveContentProps = Omit<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
  'children' | 'className'
>;

export type TooltipProps = TooltipPrimitiveContentProps & {
  children: ReactElement;
  content: ReactNode;
  className?: string;
  arrowClassName?: string;
  showArrow?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
  container?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>['container'];
};

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipPortal = TooltipPrimitive.Portal;

export const TooltipTrigger = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => <TooltipPrimitive.Trigger ref={ref} {...props} />);

TooltipTrigger.displayName = 'TooltipTrigger';

export const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(styles.content, className)}
    {...props}
  />
));

TooltipContent.displayName = 'TooltipContent';

export const TooltipArrow = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow ref={ref} className={cn(styles.arrow, className)} {...props} />
));

TooltipArrow.displayName = 'TooltipArrow';

export const Tooltip = ({
  children,
  content,
  className,
  arrowClassName,
  showArrow = true,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration = 250,
  skipDelayDuration,
  disableHoverableContent,
  container,
  sideOffset = 8,
  ...contentProps
}: TooltipProps) => {
  const controller = useTooltipController({
    open,
    defaultOpen,
    onOpenChange,
    delayDuration,
    skipDelayDuration,
    disableHoverableContent
  });

  return (
    <TooltipProvider
      delayDuration={controller.delayDuration}
      skipDelayDuration={controller.skipDelayDuration}
      disableHoverableContent={controller.disableHoverableContent}
    >
      <TooltipRoot
        open={controller.open}
        onOpenChange={controller.onOpenChange}
        delayDuration={controller.delayDuration}
        disableHoverableContent={controller.disableHoverableContent}
      >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPortal container={container}>
          <TooltipContent sideOffset={sideOffset} className={className} {...contentProps}>
            {content}
            {showArrow && <TooltipArrow className={arrowClassName} />}
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
};

Tooltip.displayName = 'Tooltip';
