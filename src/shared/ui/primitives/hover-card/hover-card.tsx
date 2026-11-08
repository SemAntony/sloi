import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './hover-card.module.scss';

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardRoot = HoverCardPrimitive.Root;
export const HoverCardTrigger = forwardRef<
  ComponentRef<typeof HoverCardPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Trigger
    ref={ref}
    className={cn(styles.hoverCardTrigger, className)}
    {...props}
  />
));

HoverCardTrigger.displayName = 'HoverCardTrigger';

export const HoverCardPortal = HoverCardPrimitive.Portal;

export const HoverCardContent = forwardRef<
  ComponentRef<typeof HoverCardPrimitive.Content>,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(styles.surfaceFloating, styles.hoverCardContent, className)}
    {...props}
  />
));

HoverCardContent.displayName = 'HoverCardContent';

export const HoverCardArrow = forwardRef<
  ComponentRef<typeof HoverCardPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Arrow ref={ref} className={cn(styles.hoverCardArrow, className)} {...props} />
));

HoverCardArrow.displayName = 'HoverCardArrow';
