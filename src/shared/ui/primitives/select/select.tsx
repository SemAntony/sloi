import { Select as SelectPrimitive } from 'radix-ui';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode
} from 'react';
import { useSelectController } from '@sloi/headless-core';
import { cn } from '../../../lib/cn/cn';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../_internal/common';
import styles from './select.module.scss';

export type SelectProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;

export const Select = ({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: SelectProps) => {
  const controller = useSelectController({
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange
  });

  return (
    <SelectPrimitive.Root
      value={controller.value}
      onValueChange={controller.onValueChange}
      open={controller.open}
      onOpenChange={controller.onOpenChange}
      {...props}
    />
  );
};

Select.displayName = 'Select';
export const SelectRoot = Select;
export const SelectGroup = SelectPrimitive.Group;
export const SelectPortal = SelectPrimitive.Portal;
export const SelectValue = SelectPrimitive.Value;

type SelectTriggerProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
  showChevron?: boolean;
  chevron?: ReactNode;
};

export const SelectTrigger = forwardRef<
  ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, showChevron = true, chevron, asChild, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    asChild={asChild}
    className={cn(styles.selectTrigger, className)}
    {...props}
  >
    {asChild
      ? children
      : (
        <>
          {children}
          {showChevron && <SelectIcon>{chevron ?? <ChevronDownIcon />}</SelectIcon>}
        </>
      )}
  </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = 'SelectTrigger';

export const SelectIcon = forwardRef<
  ComponentRef<typeof SelectPrimitive.Icon>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Icon>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Icon ref={ref} className={cn(styles.selectIcon, className)} {...props}>
    {children}
  </SelectPrimitive.Icon>
));

SelectIcon.displayName = 'SelectIcon';

export const SelectContent = forwardRef<
  ComponentRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Content
    ref={ref}
    position={position}
    className={cn(styles.surfaceFloating, styles.selectContent, className)}
    {...props}
  />
));

SelectContent.displayName = 'SelectContent';

export const SelectViewport = forwardRef<
  ComponentRef<typeof SelectPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Viewport ref={ref} className={cn(styles.selectViewport, className)} {...props} />
));

SelectViewport.displayName = 'SelectViewport';

export const SelectLabel = forwardRef<
  ComponentRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn(styles.selectLabel, className)} {...props} />
));

SelectLabel.displayName = 'SelectLabel';

export type SelectItemProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
  indicator?: ReactNode;
  showIndicator?: boolean;
};

export const SelectItem = forwardRef<ComponentRef<typeof SelectPrimitive.Item>, SelectItemProps>(
  ({ className, children, indicator, showIndicator = true, asChild, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      asChild={asChild}
      className={cn(styles.selectItem, className)}
      {...props}
    >
      {asChild
        ? children
        : (
          <>
            {showIndicator && (
              <SelectItemIndicator className={styles.selectItemIndicator}>
                {indicator ?? <CheckIcon />}
              </SelectItemIndicator>
            )}
            <SelectItemText>{children}</SelectItemText>
          </>
        )}
    </SelectPrimitive.Item>
  )
);

SelectItem.displayName = 'SelectItem';

export const SelectItemText = forwardRef<
  ComponentRef<typeof SelectPrimitive.ItemText>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ItemText>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemText ref={ref} className={cn(styles.selectItemText, className)} {...props} />
));

SelectItemText.displayName = 'SelectItemText';

export const SelectItemIndicator = forwardRef<
  ComponentRef<typeof SelectPrimitive.ItemIndicator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ItemIndicator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemIndicator
    ref={ref}
    className={cn(styles.selectItemIndicator, className)}
    {...props}
  />
));

SelectItemIndicator.displayName = 'SelectItemIndicator';

type SelectScrollUpButtonProps = ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> & {
  icon?: ReactNode;
};

export const SelectScrollUpButton = forwardRef<
  ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  SelectScrollUpButtonProps
>(({ className, children, icon, asChild, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    asChild={asChild}
    className={cn(styles.selectScrollButton, className)}
    {...props}
  >
    {asChild ? children : children ?? icon ?? <ChevronUpIcon />}
  </SelectPrimitive.ScrollUpButton>
));

SelectScrollUpButton.displayName = 'SelectScrollUpButton';

type SelectScrollDownButtonProps = ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> & {
  icon?: ReactNode;
};

export const SelectScrollDownButton = forwardRef<
  ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  SelectScrollDownButtonProps
>(({ className, children, icon, asChild, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    asChild={asChild}
    className={cn(styles.selectScrollButton, className)}
    {...props}
  >
    {asChild ? children : children ?? icon ?? <ChevronDownIcon />}
  </SelectPrimitive.ScrollDownButton>
));

SelectScrollDownButton.displayName = 'SelectScrollDownButton';

export const SelectSeparator = forwardRef<
  ComponentRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn(styles.selectSeparator, className)} {...props} />
));

SelectSeparator.displayName = 'SelectSeparator';

export const SelectArrow = forwardRef<
  ComponentRef<typeof SelectPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Arrow ref={ref} className={cn(styles.selectArrow, className)} {...props} />
));

SelectArrow.displayName = 'SelectArrow';
