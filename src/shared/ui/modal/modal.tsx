import { Dialog as DialogPrimitive, VisuallyHidden } from 'radix-ui';
import { useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
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
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...contentProps
}: ModalProps) => {
  // У Modal нет Dialog.Trigger (им управляют снаружи через `open`), а Radix возвращает фокус
  // только на Trigger: без этого после закрытия фокус терялся бы на body. Запоминаем элемент,
  // который был в фокусе до открытия, и возвращаем фокус на него.
  const openerRef = useRef<HTMLElement | null>(null);

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
          onOpenAutoFocus={(event) => {
            openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            onOpenAutoFocus?.(event);
          }}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event);

            if (event.defaultPrevented) {
              return;
            }

            event.preventDefault();
            const opener = openerRef.current;
            openerRef.current = null;

            if (opener?.isConnected) {
              opener.focus();
            }
          }}
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
