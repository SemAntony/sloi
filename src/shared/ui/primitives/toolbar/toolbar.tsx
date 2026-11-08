import { Toolbar as ToolbarPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './toolbar.module.scss';

export const Toolbar = forwardRef<
  ComponentRef<typeof ToolbarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root ref={ref} className={cn(styles.toolbarRoot, className)} {...props} />
));

Toolbar.displayName = 'Toolbar';
export const ToolbarRoot = Toolbar;

export const ToolbarButton = forwardRef<
  ComponentRef<typeof ToolbarPrimitive.Button>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Button ref={ref} className={cn(styles.toolbarButton, className)} {...props} />
));

ToolbarButton.displayName = 'ToolbarButton';

export const ToolbarLink = forwardRef<
  ComponentRef<typeof ToolbarPrimitive.Link>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Link>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Link ref={ref} className={cn(styles.toolbarLink, className)} {...props} />
));

ToolbarLink.displayName = 'ToolbarLink';

export const ToolbarSeparator = forwardRef<
  ComponentRef<typeof ToolbarPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cn(styles.toolbarSeparator, className)}
    {...props}
  />
));

ToolbarSeparator.displayName = 'ToolbarSeparator';

export const ToolbarToggleGroup = forwardRef<
  ComponentRef<typeof ToolbarPrimitive.ToggleGroup>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleGroup>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.ToggleGroup
    ref={ref}
    className={cn(styles.toolbarToggleGroup, className)}
    {...props}
  />
));

ToolbarToggleGroup.displayName = 'ToolbarToggleGroup';

export const ToolbarToggleItem = forwardRef<
  ComponentRef<typeof ToolbarPrimitive.ToggleItem>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleItem>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.ToggleItem
    ref={ref}
    className={cn(styles.toolbarToggleItem, className)}
    {...props}
  />
));

ToolbarToggleItem.displayName = 'ToolbarToggleItem';
