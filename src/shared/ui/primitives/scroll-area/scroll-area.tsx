import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './scroll-area.module.scss';

export const ScrollArea = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn(styles.scrollAreaRoot, className)} {...props} />
));

ScrollArea.displayName = 'ScrollArea';
export const ScrollAreaRoot = ScrollArea;

export const ScrollAreaScrollbar = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Scrollbar>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(styles.scrollAreaScrollbar, className)}
    {...props}
  />
));

ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

export const ScrollAreaThumb = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Thumb>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Thumb ref={ref} className={cn(styles.scrollAreaThumb, className)} {...props} />
));

ScrollAreaThumb.displayName = 'ScrollAreaThumb';

export const ScrollAreaViewport = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={cn(styles.scrollAreaViewport, className)}
    {...props}
  />
));

ScrollAreaViewport.displayName = 'ScrollAreaViewport';

export const ScrollAreaCorner = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Corner>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Corner>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Corner ref={ref} className={cn(styles.scrollAreaCorner, className)} {...props} />
));

ScrollAreaCorner.displayName = 'ScrollAreaCorner';
