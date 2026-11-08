import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, type ReactNode } from 'react';
import { cn } from '../../../lib/cn/cn';
import { DotIcon } from '../_internal/common';
import styles from './radio-group.module.scss';

export const RadioGroup = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn(styles.radioGroupRoot, className)} {...props} />
));

RadioGroup.displayName = 'RadioGroup';
export const RadioGroupRoot = RadioGroup;

export const RadioGroupIndicator = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Indicator
    ref={ref}
    className={cn(styles.radioIndicator, className)}
    {...props}
  />
));

RadioGroupIndicator.displayName = 'RadioGroupIndicator';

export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
  indicator?: ReactNode;
  showIndicator?: boolean;
};

export const RadioGroupItem = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, children, indicator, showIndicator = true, asChild, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(styles.radioItem, className)}
    asChild={asChild}
    {...props}
  >
    {asChild
      ? children
      : (
        <>
          {showIndicator && (
            <RadioGroupIndicator>
              {indicator ?? children ?? <DotIcon />}
            </RadioGroupIndicator>
          )}
        </>
      )}
  </RadioGroupPrimitive.Item>
));

RadioGroupItem.displayName = 'RadioGroupItem';
