import { Dialog as DialogPrimitive, VisuallyHidden } from 'radix-ui';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './modal.module.scss';

export type ModalProps = {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  closeButton?: boolean;
  container?: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>['container'];
} & Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, 'children'>;

export const Modal = ({
  open,
  onClose,
  onOpenChange,
  title,
  children,
  className,
  overlayClassName,
  closeButton = true,
  container,
  ...contentProps
}: ModalProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);

    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className={cn(styles.overlay, overlayClassName)} />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(styles.content, className)}
          {...contentProps}
        >
          {title ? (
            <DialogPrimitive.Title className={styles.title}>{title}</DialogPrimitive.Title>
          ) : (
            <DialogPrimitive.Title className={styles.hiddenTitle}>
              <VisuallyHidden.Root>Modal</VisuallyHidden.Root>
            </DialogPrimitive.Title>
          )}

          {closeButton && (
            <DialogPrimitive.Close className={styles.closeButton} aria-label="Close">
              x
            </DialogPrimitive.Close>
          )}

          <div className={styles.body}>{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

Modal.displayName = 'Modal';
