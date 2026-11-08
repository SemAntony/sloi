import { Accordion as AccordionPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, type ReactNode } from 'react';
import { cn } from '../../../lib/cn/cn';
import { ChevronDownIcon } from '../_internal/common';
import styles from './accordion.module.scss';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(styles.accordionItem, className)} {...props} />
));

AccordionItem.displayName = 'AccordionItem';

export const AccordionHeader = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Header>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Header
    ref={ref}
    className={cn(styles.accordionHeader, className)}
    {...props}
  />
));

AccordionHeader.displayName = 'AccordionHeader';

export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  icon?: ReactNode;
  showIcon?: boolean;
};

export const AccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, showIcon = true, asChild, ...props }, ref) => {
  const triggerChildren = asChild
    ? children
    : (
      <>
        {children}
        {showIcon && (icon === undefined ? <ChevronDownIcon className={styles.accordionChevron} /> : icon)}
      </>
    );

  return (
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(styles.accordionTrigger, className)}
      asChild={asChild}
      {...props}
    >
      {triggerChildren}
    </AccordionPrimitive.Trigger>
  );
});

AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(styles.accordionContent, className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = 'AccordionContent';
