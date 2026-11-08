import { Tabs as TabsPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { useTabsController } from '@sloi/headless-core';
import { cn } from '../../../lib/cn/cn';
import styles from './tabs.module.scss';

export const Tabs = forwardRef<
  ComponentRef<typeof TabsPrimitive.Root>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, value, defaultValue, onValueChange, ...props }, ref) => {
  const controller = useTabsController({
    value,
    defaultValue,
    onValueChange
  });

  return (
    <TabsPrimitive.Root
      ref={ref}
      value={controller.value}
      onValueChange={controller.onValueChange}
      className={cn(styles.tabsRoot, className)}
      {...props}
    />
  );
});

Tabs.displayName = 'Tabs';
export const TabsRoot = Tabs;

export const TabsList = forwardRef<
  ComponentRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn(styles.tabsList, className)} {...props} />
));

TabsList.displayName = 'TabsList';

export const TabsTrigger = forwardRef<
  ComponentRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn(styles.tabsTrigger, className)} {...props} />
));

TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<
  ComponentRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn(styles.tabsContent, className)} {...props} />
));

TabsContent.displayName = 'TabsContent';
