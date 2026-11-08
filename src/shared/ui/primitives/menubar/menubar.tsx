import { Menubar as MenubarPrimitive } from 'radix-ui';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import { cn } from '../../../lib/cn/cn';
import { CheckIcon, ChevronRightIcon, DotIcon } from '../_internal/common';
import styles from './menubar.module.scss';

export const Menubar = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root ref={ref} className={cn(styles.menubarRoot, className)} {...props} />
));

Menubar.displayName = 'Menubar';

export const MenubarRoot = Menubar;
export const MenubarMenu = MenubarPrimitive.Menu;
export const MenubarPortal = MenubarPrimitive.Portal;
export const MenubarGroup = MenubarPrimitive.Group;
export const MenubarSub = MenubarPrimitive.Sub;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

export const MenubarTrigger = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(styles.menubarTrigger, className)}
    {...props}
  />
));

MenubarTrigger.displayName = 'MenubarTrigger';

export const MenubarContent = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Content>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = 'start', sideOffset = 6, ...props }, ref) => (
  <MenubarPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(styles.surfaceFloating, styles.menuContent, className)}
    {...props}
  />
));

MenubarContent.displayName = 'MenubarContent';

export const MenubarSubContent = forwardRef<
  ComponentRef<typeof MenubarPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    sideOffset={sideOffset}
    className={cn(styles.surfaceFloating, styles.menuSubContent, className)}
    {...props}
  />
));

MenubarSubContent.displayName = 'MenubarSubContent';

export type MenubarItemProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
};

export const MenubarItem = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Item>,
  MenubarItemProps
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(styles.menuItem, inset && styles.menuInset, className)}
    {...props}
  />
));

MenubarItem.displayName = 'MenubarItem';

export type MenubarLabelProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
};

export const MenubarLabel = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Label>,
  MenubarLabelProps
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(styles.menuLabel, inset && styles.menuInset, className)}
    {...props}
  />
));

MenubarLabel.displayName = 'MenubarLabel';

export const MenubarSeparator = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn(styles.menuSeparator, className)} {...props} />
));

MenubarSeparator.displayName = 'MenubarSeparator';

export const MenubarArrow = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Arrow ref={ref} className={cn(styles.menuArrow, className)} {...props} />
));

MenubarArrow.displayName = 'MenubarArrow';

export const MenubarItemIndicator = forwardRef<
  ComponentRef<typeof MenubarPrimitive.ItemIndicator>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.ItemIndicator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.ItemIndicator
    ref={ref}
    className={cn(styles.menuItemIndicator, className)}
    {...props}
  />
));

MenubarItemIndicator.displayName = 'MenubarItemIndicator';

export type MenubarCheckboxItemProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> & {
  indicator?: ReactNode;
  showIndicator?: boolean;
};

export const MenubarCheckboxItem = forwardRef<
  ComponentRef<typeof MenubarPrimitive.CheckboxItem>,
  MenubarCheckboxItemProps
>(({ className, children, indicator, showIndicator = true, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(styles.menuCheckboxItem, styles.menuInset, className)}
    {...props}
  >
    {showIndicator && (
      <span className={styles.menuItemIndicatorSlot}>
        <MenubarItemIndicator>{indicator ?? <CheckIcon />}</MenubarItemIndicator>
      </span>
    )}
    {children}
  </MenubarPrimitive.CheckboxItem>
));

MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export type MenubarRadioItemProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> & {
  indicator?: ReactNode;
  showIndicator?: boolean;
};

export const MenubarRadioItem = forwardRef<
  ComponentRef<typeof MenubarPrimitive.RadioItem>,
  MenubarRadioItemProps
>(({ className, children, indicator, showIndicator = true, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(styles.menuRadioItem, styles.menuInset, className)}
    {...props}
  >
    {showIndicator && (
      <span className={styles.menuItemIndicatorSlot}>
        <MenubarItemIndicator>{indicator ?? <DotIcon />}</MenubarItemIndicator>
      </span>
    )}
    {children}
  </MenubarPrimitive.RadioItem>
));

MenubarRadioItem.displayName = 'MenubarRadioItem';

export type MenubarSubTriggerProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
  chevron?: ReactNode;
  showChevron?: boolean;
};

export const MenubarSubTrigger = forwardRef<
  ComponentRef<typeof MenubarPrimitive.SubTrigger>,
  MenubarSubTriggerProps
>(({ className, inset, children, chevron, showChevron = true, asChild, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
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
  </MenubarPrimitive.SubTrigger>
));

MenubarSubTrigger.displayName = 'MenubarSubTrigger';

export const MenubarShortcut = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn(styles.menuShortcut, className)} {...props} />
);

MenubarShortcut.displayName = 'MenubarShortcut';
