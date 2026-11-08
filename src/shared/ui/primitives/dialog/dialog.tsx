import { Dialog as DialogPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, type ReactNode } from 'react';
import { useDialogController } from '@sloi/headless-core';
import { cn } from '../../../lib/cn/cn';
import styles from './dialog.module.scss';

export type DialogProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

export const Dialog = ({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: DialogProps) => {
  const controller = useDialogController({
    open,
    defaultOpen,
    onOpenChange
  });

  return (
    <DialogPrimitive.Root
      open={controller.open}
      onOpenChange={controller.onOpenChange}
      {...props}
    />
  );
};
Dialog.displayName = 'Dialog';

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn(styles.overlay, className)} {...props} />
));

DialogOverlay.displayName = 'DialogOverlay';

export const DialogContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn(styles.surfaceFloating, styles.dialogContent, className)}
    {...props}
  />
));

DialogContent.displayName = 'DialogContent';

export const DialogTitle = forwardRef<
  ComponentRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn(styles.dialogTitle, className)} {...props} />
));

DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(styles.dialogDescription, className)}
    {...props}
  />
));

DialogDescription.displayName = 'DialogDescription';

export type DialogCloseButtonProps = Omit<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Close>,
  'asChild'
> & {
  icon?: ReactNode;
  label?: string;
};

export const DialogCloseButton = forwardRef<
  ComponentRef<typeof DialogPrimitive.Close>,
  DialogCloseButtonProps
>(({ className, icon, label = 'Close dialog', children, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(styles.dialogCloseButton, className)}
    aria-label={label}
    {...props}
  >
    {children ?? icon ?? <span aria-hidden>×</span>}
  </DialogPrimitive.Close>
));

DialogCloseButton.displayName = 'DialogCloseButton';
