import { Toggle as TogglePrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './toggle.module.scss';

export const Toggle = forwardRef<
  ComponentRef<typeof TogglePrimitive.Root>,
  ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(styles.toggleRoot, className)} {...props} />
));

Toggle.displayName = 'Toggle';
export const ToggleRoot = Toggle;
