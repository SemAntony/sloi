import { Form as FormPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './form.module.scss';

export const Form = forwardRef<
  ComponentRef<typeof FormPrimitive.Root>,
  ComponentPropsWithoutRef<typeof FormPrimitive.Root>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Root ref={ref} className={cn(styles.formRoot, className)} {...props} />
));

Form.displayName = 'Form';

export const FormRoot = Form;

export const FormField = forwardRef<
  ComponentRef<typeof FormPrimitive.Field>,
  ComponentPropsWithoutRef<typeof FormPrimitive.Field>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Field ref={ref} className={cn(styles.formField, className)} {...props} />
));

FormField.displayName = 'FormField';

export const FormLabel = forwardRef<
  ComponentRef<typeof FormPrimitive.Label>,
  ComponentPropsWithoutRef<typeof FormPrimitive.Label>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Label ref={ref} className={cn(styles.label, className)} {...props} />
));

FormLabel.displayName = 'FormLabel';

export const FormControl = forwardRef<
  ComponentRef<typeof FormPrimitive.Control>,
  ComponentPropsWithoutRef<typeof FormPrimitive.Control>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Control ref={ref} className={cn(styles.control, className)} {...props} />
));

FormControl.displayName = 'FormControl';

export const FormMessage = forwardRef<
  ComponentRef<typeof FormPrimitive.Message>,
  ComponentPropsWithoutRef<typeof FormPrimitive.Message>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Message ref={ref} className={cn(styles.formMessage, className)} {...props} />
));

FormMessage.displayName = 'FormMessage';

export const FormSubmit = forwardRef<
  ComponentRef<typeof FormPrimitive.Submit>,
  ComponentPropsWithoutRef<typeof FormPrimitive.Submit>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Submit ref={ref} className={cn(styles.formSubmit, className)} {...props} />
));

FormSubmit.displayName = 'FormSubmit';

export const FormValidityState = (props: ComponentPropsWithoutRef<typeof FormPrimitive.ValidityState>) => (
  <FormPrimitive.ValidityState {...props} />
);

FormValidityState.displayName = 'FormValidityState';
