import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './toggle-group.module.scss';

export const ToggleGroup = forwardRef<
  ComponentRef<typeof ToggleGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn(styles.toggleGroupRoot, className)} {...props} />
));

ToggleGroup.displayName = 'ToggleGroup';
export const ToggleGroupRoot = ToggleGroup;

export const ToggleGroupItem = forwardRef<
  ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(styles.toggleGroupItem, className)}
    {...props}
  />
));

ToggleGroupItem.displayName = 'ToggleGroupItem';
