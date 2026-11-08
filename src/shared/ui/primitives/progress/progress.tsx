import { Progress as ProgressPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './progress.module.scss';

export const Progress = forwardRef<
  ComponentRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn(styles.progressRoot, className)} {...props} />
));

Progress.displayName = 'Progress';
export const ProgressRoot = Progress;

export const ProgressIndicator = forwardRef<
  ComponentRef<typeof ProgressPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Indicator
    ref={ref}
    className={cn(styles.progressIndicator, className)}
    {...props}
  />
));

ProgressIndicator.displayName = 'ProgressIndicator';
