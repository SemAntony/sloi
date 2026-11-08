import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, type ReactNode } from 'react';
import { cn } from '../../../lib/cn/cn';
import { ChevronDownIcon } from '../_internal/common';
import styles from './navigation-menu.module.scss';

export const NavigationMenu = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(styles.navigationMenuRoot, className)}
    {...props}
  />
));

NavigationMenu.displayName = 'NavigationMenu';

export const NavigationMenuRoot = NavigationMenu;

export const NavigationMenuSub = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Sub>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Sub>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Sub
    ref={ref}
    className={cn(styles.navigationMenuSub, className)}
    {...props}
  />
));

NavigationMenuSub.displayName = 'NavigationMenuSub';

export const NavigationMenuList = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(styles.navigationMenuList, className)}
    {...props}
  />
));

NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItem = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Item
    ref={ref}
    className={cn(styles.navigationMenuItem, className)}
    {...props}
  />
));

NavigationMenuItem.displayName = 'NavigationMenuItem';

export type NavigationMenuTriggerProps = ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {
  chevron?: ReactNode;
  showChevron?: boolean;
};

export const NavigationMenuTrigger = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, chevron, showChevron = true, asChild, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(styles.navigationMenuTrigger, className)}
    asChild={asChild}
    {...props}
  >
    {asChild
      ? children
      : (
        <>
          {children}
          {showChevron && (chevron ?? <ChevronDownIcon className={styles.triggerChevron} aria-hidden />)}
        </>
      )}
  </NavigationMenuPrimitive.Trigger>
));

NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export const NavigationMenuContent = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(styles.surfaceFloating, styles.navigationMenuContent, className)}
    {...props}
  />
));

NavigationMenuContent.displayName = 'NavigationMenuContent';

export const NavigationMenuLink = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Link>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    className={cn(styles.navigationMenuLink, className)}
    {...props}
  />
));

NavigationMenuLink.displayName = 'NavigationMenuLink';

export const NavigationMenuIndicator = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(styles.navigationMenuIndicator, className)}
    {...props}
  />
));

NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

export const NavigationMenuViewport = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Viewport
    ref={ref}
    className={cn(styles.surfaceFloating, styles.navigationMenuViewport, className)}
    {...props}
  />
));

NavigationMenuViewport.displayName = 'NavigationMenuViewport';
