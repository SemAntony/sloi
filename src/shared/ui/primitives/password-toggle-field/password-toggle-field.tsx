import { unstable_PasswordToggleField as PasswordToggleFieldPrimitive } from 'radix-ui';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode
} from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './password-toggle-field.module.scss';

/**
 * @experimental Обёртка над `unstable_PasswordToggleField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export type PasswordToggleFieldProps = ComponentPropsWithoutRef<
  typeof PasswordToggleFieldPrimitive.Root
> & {
  className?: string;
  children?: ReactNode;
};

/**
 * @experimental Обёртка над `unstable_PasswordToggleField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const PasswordToggleField = forwardRef<
  HTMLDivElement,
  PasswordToggleFieldProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.passwordFieldRoot, className)}>
    <PasswordToggleFieldPrimitive.Root {...props} />
  </div>
));

PasswordToggleField.displayName = 'PasswordToggleField';
/**
 * @experimental Обёртка над `unstable_PasswordToggleField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const PasswordToggleFieldRoot = PasswordToggleField;

/**
 * @experimental Обёртка над `unstable_PasswordToggleField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const PasswordToggleFieldInput = forwardRef<
  ComponentRef<typeof PasswordToggleFieldPrimitive.Input>,
  ComponentPropsWithoutRef<typeof PasswordToggleFieldPrimitive.Input>
>(({ className, ...props }, ref) => (
  <PasswordToggleFieldPrimitive.Input
    ref={ref}
    className={cn(styles.passwordInput, className)}
    {...props}
  />
));

PasswordToggleFieldInput.displayName = 'PasswordToggleFieldInput';

/**
 * @experimental Обёртка над `unstable_PasswordToggleField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const PasswordToggleFieldToggle = forwardRef<
  ComponentRef<typeof PasswordToggleFieldPrimitive.Toggle>,
  ComponentPropsWithoutRef<typeof PasswordToggleFieldPrimitive.Toggle>
>(({ className, ...props }, ref) => (
  <PasswordToggleFieldPrimitive.Toggle
    ref={ref}
    className={cn(styles.passwordToggle, className)}
    {...props}
  />
));

PasswordToggleFieldToggle.displayName = 'PasswordToggleFieldToggle';

/**
 * @experimental Обёртка над `unstable_PasswordToggleField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const PasswordToggleFieldSlot = PasswordToggleFieldPrimitive.Slot;
PasswordToggleFieldSlot.displayName = 'PasswordToggleFieldSlot';

/**
 * @experimental Обёртка над `unstable_PasswordToggleField` из radix-ui. API может измениться
 * в minor-релизах и не считается semver-stable до выхода из эксперимента.
 */
export const PasswordToggleFieldIcon = forwardRef<
  ComponentRef<typeof PasswordToggleFieldPrimitive.Icon>,
  ComponentPropsWithoutRef<typeof PasswordToggleFieldPrimitive.Icon>
>(({ className, ...props }, ref) => (
  <PasswordToggleFieldPrimitive.Icon
    ref={ref}
    className={cn(styles.passwordIcon, className)}
    {...props}
  />
));

PasswordToggleFieldIcon.displayName = 'PasswordToggleFieldIcon';
