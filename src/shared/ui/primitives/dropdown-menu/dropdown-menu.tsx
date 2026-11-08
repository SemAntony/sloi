import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import { cn } from '../../../lib/cn/cn';
import { CheckIcon, ChevronRightIcon, DotIcon } from '../_internal/common';
import styles from './dropdown-menu.module.scss';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuRoot = DropdownMenuPrimitive.Root;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownMenuTrigger = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={cn(styles.menuTrigger, className)}
    {...props}
  />
));

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuContent = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    ref={ref}
    className={cn(styles.surfaceFloating, styles.menuContent, className)}
    {...props}
  />
));

DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuSubContent = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(styles.surfaceFloating, styles.menuSubContent, className)}
    sideOffset={sideOffset}
    {...props}
  />
));

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
};

export const DropdownMenuItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(styles.menuItem, inset && styles.menuInset, className)}
    {...props}
  />
));

DropdownMenuItem.displayName = 'DropdownMenuItem';

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
};

export const DropdownMenuLabel = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(styles.menuLabel, inset && styles.menuInset, className)}
    {...props}
  />
));

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn(styles.menuSeparator, className)} {...props} />
));

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuArrow = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Arrow ref={ref} className={cn(styles.menuArrow, className)} {...props} />
));

DropdownMenuArrow.displayName = 'DropdownMenuArrow';

export const DropdownMenuItemIndicator = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.ItemIndicator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.ItemIndicator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.ItemIndicator
    ref={ref}
    className={cn(styles.menuItemIndicator, className)}
    {...props}
  />
));

DropdownMenuItemIndicator.displayName = 'DropdownMenuItemIndicator';

export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
  indicator?: ReactNode;
  showIndicator?: boolean;
};

export const DropdownMenuCheckboxItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, indicator, showIndicator = true, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(styles.menuCheckboxItem, styles.menuInset, className)}
    {...props}
  >
    {showIndicator && (
      <span className={styles.menuItemIndicatorSlot}>
        <DropdownMenuItemIndicator>{indicator ?? <CheckIcon />}</DropdownMenuItemIndicator>
      </span>
    )}
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
  indicator?: ReactNode;
  showIndicator?: boolean;
};

export const DropdownMenuRadioItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, indicator, showIndicator = true, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(styles.menuRadioItem, styles.menuInset, className)}
    {...props}
  >
    {showIndicator && (
      <span className={styles.menuItemIndicatorSlot}>
        <DropdownMenuItemIndicator>{indicator ?? <DotIcon />}</DropdownMenuItemIndicator>
      </span>
    )}
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export type DropdownMenuSubTriggerProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
  chevron?: ReactNode;
  showChevron?: boolean;
};

export const DropdownMenuSubTrigger = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, chevron, showChevron = true, asChild, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
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
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export const DropdownMenuShortcut = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn(styles.menuShortcut, className)} {...props} />
);

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';
