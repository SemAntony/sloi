import { Popover as PopoverPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './popover.module.scss';

export const Popover = PopoverPrimitive.Root;
export const PopoverRoot = PopoverPrimitive.Root;

export const PopoverTrigger = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger ref={ref} className={cn(styles.popoverTrigger, className)} {...props} />
));

PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverAnchor = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Anchor>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Anchor ref={ref} className={cn(styles.popoverAnchor, className)} {...props} />
));

PopoverAnchor.displayName = 'PopoverAnchor';

export const PopoverPortal = PopoverPrimitive.Portal;

export const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(styles.surfaceFloating, styles.popoverContent, className)}
    {...props}
  />
));

PopoverContent.displayName = 'PopoverContent';

export const PopoverArrow = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow ref={ref} className={cn(styles.popoverArrow, className)} {...props} />
));

PopoverArrow.displayName = 'PopoverArrow';

export const PopoverClose = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Close>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Close ref={ref} className={cn(styles.closeButton, className)} {...props} />
));

PopoverClose.displayName = 'PopoverClose';
