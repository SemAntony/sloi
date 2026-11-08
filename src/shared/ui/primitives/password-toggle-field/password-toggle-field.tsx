import { unstable_PasswordToggleField as PasswordToggleFieldPrimitive } from 'radix-ui';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode
} from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './password-toggle-field.module.scss';

export type PasswordToggleFieldProps = ComponentPropsWithoutRef<
  typeof PasswordToggleFieldPrimitive.Root
> & {
  className?: string;
  children?: ReactNode;
};

export const PasswordToggleField = forwardRef<
  HTMLDivElement,
  PasswordToggleFieldProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.passwordFieldRoot, className)}>
    <PasswordToggleFieldPrimitive.Root {...props} />
  </div>
));

PasswordToggleField.displayName = 'PasswordToggleField';
export const PasswordToggleFieldRoot = PasswordToggleField;

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

export const PasswordToggleFieldSlot = PasswordToggleFieldPrimitive.Slot;
PasswordToggleFieldSlot.displayName = 'PasswordToggleFieldSlot';

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
