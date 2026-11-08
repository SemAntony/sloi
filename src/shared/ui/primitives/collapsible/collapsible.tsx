import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, type ReactNode } from 'react';
import { cn } from '../../../lib/cn/cn';
import { ChevronDownIcon } from '../_internal/common';
import styles from './collapsible.module.scss';

export const Collapsible = forwardRef<
  ComponentRef<typeof CollapsiblePrimitive.Root>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    className={cn(styles.collapsibleRoot, className)}
    {...props}
  />
));

Collapsible.displayName = 'Collapsible';

export const CollapsibleRoot = Collapsible;

export type CollapsibleTriggerProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
  icon?: ReactNode;
  showIcon?: boolean;
};

export const CollapsibleTrigger = forwardRef<
  ComponentRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps
>(({ className, children, icon, showIcon = true, asChild, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(styles.collapsibleTrigger, className)}
    asChild={asChild}
    {...props}
  >
    {asChild
      ? children
      : (
        <>
          {children}
          {showIcon && (icon === undefined ? <ChevronDownIcon className={styles.collapsibleChevron} /> : icon)}
        </>
      )}
  </CollapsiblePrimitive.Trigger>
));

CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export const CollapsibleContent = forwardRef<
  ComponentRef<typeof CollapsiblePrimitive.Content>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(styles.collapsibleContent, className)}
    {...props}
  />
));

CollapsibleContent.displayName = 'CollapsibleContent';

export const CollapsibleTriggerIcon = ChevronDownIcon;
