import { Toast as ToastPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './toast.module.scss';

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = forwardRef<
  ComponentRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport ref={ref} className={cn(styles.toastViewport, className)} {...props} />
));

ToastViewport.displayName = 'ToastViewport';

export const Toast = forwardRef<
  ComponentRef<typeof ToastPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Root ref={ref} className={cn(styles.toastRoot, className)} {...props} />
));

Toast.displayName = 'Toast';
export const ToastRoot = Toast;

export const ToastTitle = forwardRef<
  ComponentRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn(styles.toastTitle, className)} {...props} />
));

ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<
  ComponentRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn(styles.toastDescription, className)}
    {...props}
  />
));

ToastDescription.displayName = 'ToastDescription';

export const ToastAction = forwardRef<
  ComponentRef<typeof ToastPrimitive.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action ref={ref} className={cn(styles.toastAction, className)} {...props} />
));

ToastAction.displayName = 'ToastAction';

export const ToastClose = forwardRef<
  ComponentRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close ref={ref} className={cn(styles.toastClose, className)} {...props} />
));

ToastClose.displayName = 'ToastClose';
