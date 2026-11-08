import { Switch as SwitchPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './switch.module.scss';

export const Switch = forwardRef<
  ComponentRef<typeof SwitchPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root ref={ref} className={cn(styles.switchRoot, className)} {...props} />
));

Switch.displayName = 'Switch';
export const SwitchRoot = Switch;

export const SwitchThumb = forwardRef<
  ComponentRef<typeof SwitchPrimitive.Thumb>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Thumb ref={ref} className={cn(styles.switchThumb, className)} {...props} />
));

SwitchThumb.displayName = 'SwitchThumb';
