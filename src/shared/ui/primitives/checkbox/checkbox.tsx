import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, type ReactNode } from 'react';
import { cn } from '../../../lib/cn/cn';
import { CheckIcon } from '../_internal/common';
import styles from './checkbox.module.scss';

const IndeterminateIcon = ({ className }: { className?: string }) => (
  <span aria-hidden className={className}>
    −
  </span>
);

export type CheckboxIndicatorProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator> & {
  checkedIcon?: ReactNode;
  indeterminateIcon?: ReactNode;
  showDefaultIcons?: boolean;
};

export const CheckboxIndicator = forwardRef<
  ComponentRef<typeof CheckboxPrimitive.Indicator>,
  CheckboxIndicatorProps
>(({ className, children, checkedIcon, indeterminateIcon, showDefaultIcons = true, ...props }, ref) => (
  <CheckboxPrimitive.Indicator ref={ref} className={cn(styles.checkboxIndicator, className)} {...props}>
    {children ?? (showDefaultIcons ? (
      <>
        {checkedIcon ?? <CheckIcon className={styles.checkboxCheckIcon} />}
        {indeterminateIcon ?? <IndeterminateIcon className={styles.checkboxIndeterminateIcon} />}
      </>
    ) : null)}
  </CheckboxPrimitive.Indicator>
));

CheckboxIndicator.displayName = 'CheckboxIndicator';

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  showIndicator?: boolean;
  checkedIcon?: ReactNode;
  indeterminateIcon?: ReactNode;
};

export const Checkbox = forwardRef<
  ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, children, asChild, showIndicator = true, checkedIcon, indeterminateIcon, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn(styles.checkboxRoot, className)} asChild={asChild} {...props}>
    {asChild
      ? children
      : (showIndicator ? (
        <CheckboxIndicator checkedIcon={checkedIcon} indeterminateIcon={indeterminateIcon}>
          {children}
        </CheckboxIndicator>
      ) : children)}
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = 'Checkbox';
