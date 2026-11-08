import { Separator as SeparatorPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './separator.module.scss';

export const Separator = forwardRef<
  ComponentRef<typeof SeparatorPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SeparatorPrimitive.Root ref={ref} className={cn(styles.separator, className)} {...props} />
));

Separator.displayName = 'Separator';
export const SeparatorRoot = Separator;
