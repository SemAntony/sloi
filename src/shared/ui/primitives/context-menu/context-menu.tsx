import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import { cn } from '../../../lib/cn/cn';
import { CheckIcon, ChevronRightIcon, DotIcon } from '../_internal/common';
import styles from './context-menu.module.scss';

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuRoot = ContextMenuPrimitive.Root;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export const ContextMenuTrigger = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Trigger
    ref={ref}
    className={cn(styles.menuTrigger, className)}
    {...props}
  />
));

ContextMenuTrigger.displayName = 'ContextMenuTrigger';

export const ContextMenuContent = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Content
    ref={ref}
    className={cn(styles.surfaceFloating, styles.menuContent, className)}
    {...props}
  />
));

ContextMenuContent.displayName = 'ContextMenuContent';

export const ContextMenuSubContent = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(styles.surfaceFloating, styles.menuSubContent, className)}
    sideOffset={sideOffset}
    {...props}
  />
));

ContextMenuSubContent.displayName = 'ContextMenuSubContent';

export type ContextMenuItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
};

export const ContextMenuItem = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(styles.menuItem, inset && styles.menuInset, className)}
    {...props}
  />
));

ContextMenuItem.displayName = 'ContextMenuItem';

export type ContextMenuLabelProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
};

export const ContextMenuLabel = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Label>,
  ContextMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(styles.menuLabel, inset && styles.menuInset, className)}
    {...props}
  />
));

ContextMenuLabel.displayName = 'ContextMenuLabel';

export const ContextMenuSeparator = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cn(styles.menuSeparator, className)} {...props} />
));

ContextMenuSeparator.displayName = 'ContextMenuSeparator';

export const ContextMenuArrow = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Arrow ref={ref} className={cn(styles.menuArrow, className)} {...props} />
));

ContextMenuArrow.displayName = 'ContextMenuArrow';

export const ContextMenuItemIndicator = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.ItemIndicator>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.ItemIndicator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.ItemIndicator
    ref={ref}
    className={cn(styles.menuItemIndicator, className)}
    {...props}
  />
));

ContextMenuItemIndicator.displayName = 'ContextMenuItemIndicator';

export type ContextMenuCheckboxItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> & {
  indicator?: ReactNode;
  showIndicator?: boolean;
};

export const ContextMenuCheckboxItem = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, children, indicator, showIndicator = true, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(styles.menuCheckboxItem, styles.menuInset, className)}
    {...props}
  >
    {showIndicator && (
      <span className={styles.menuItemIndicatorSlot}>
        <ContextMenuItemIndicator>{indicator ?? <CheckIcon />}</ContextMenuItemIndicator>
      </span>
    )}
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));

ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

export type ContextMenuRadioItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> & {
  indicator?: ReactNode;
  showIndicator?: boolean;
};

export const ContextMenuRadioItem = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(({ className, children, indicator, showIndicator = true, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(styles.menuRadioItem, styles.menuInset, className)}
    {...props}
  >
    {showIndicator && (
      <span className={styles.menuItemIndicatorSlot}>
        <ContextMenuItemIndicator>{indicator ?? <DotIcon />}</ContextMenuItemIndicator>
      </span>
    )}
    {children}
  </ContextMenuPrimitive.RadioItem>
));

ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

export type ContextMenuSubTriggerProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
  chevron?: ReactNode;
  showChevron?: boolean;
};

export const ContextMenuSubTrigger = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, children, chevron, showChevron = true, asChild, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(styles.menuSubTrigger, inset && styles.menuInset, className)}
    asChild={asChild}
    {...props}
  >
    {asChild
      ? children
      : (
        <>
          {children}
          {showChevron && (chevron ?? <ChevronRightIcon className={styles.menuShortcut} />)}
        </>
      )}
  </ContextMenuPrimitive.SubTrigger>
));

ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

export const ContextMenuShortcut = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn(styles.menuShortcut, className)} {...props} />
);

ContextMenuShortcut.displayName = 'ContextMenuShortcut';
