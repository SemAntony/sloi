import { unstable_OneTimePasswordField as OneTimePasswordFieldPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './one-time-password-field.module.scss';

/**
 * @experimental Обёртка над `unstable_OneTimePasswordField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const OneTimePasswordField = forwardRef<
  ComponentRef<typeof OneTimePasswordFieldPrimitive.Root>,
  ComponentPropsWithoutRef<typeof OneTimePasswordFieldPrimitive.Root>
>(({ className, ...props }, ref) => (
  <OneTimePasswordFieldPrimitive.Root
    ref={ref}
    className={cn(styles.otpRoot, className)}
    {...props}
  />
));

OneTimePasswordField.displayName = 'OneTimePasswordField';
/**
 * @experimental Обёртка над `unstable_OneTimePasswordField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const OneTimePasswordFieldRoot = OneTimePasswordField;

/**
 * @experimental Обёртка над `unstable_OneTimePasswordField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const OneTimePasswordFieldInput = forwardRef<
  ComponentRef<typeof OneTimePasswordFieldPrimitive.Input>,
  ComponentPropsWithoutRef<typeof OneTimePasswordFieldPrimitive.Input>
>(({ className, ...props }, ref) => (
  <OneTimePasswordFieldPrimitive.Input
    ref={ref}
    className={cn(styles.otpInput, className)}
    {...props}
  />
));

OneTimePasswordFieldInput.displayName = 'OneTimePasswordFieldInput';

/**
 * @experimental Обёртка над `unstable_OneTimePasswordField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const OneTimePasswordFieldHiddenInput = forwardRef<
  ComponentRef<typeof OneTimePasswordFieldPrimitive.HiddenInput>,
  ComponentPropsWithoutRef<typeof OneTimePasswordFieldPrimitive.HiddenInput>
>(({ className, ...props }, ref) => (
  <OneTimePasswordFieldPrimitive.HiddenInput
    ref={ref}
    className={cn(styles.otpHiddenInput, className)}
    {...props}
  />
));

OneTimePasswordFieldHiddenInput.displayName = 'OneTimePasswordFieldHiddenInput';
