import {
  AccessibleIcon as AccessibleIconPrimitive,
  Direction as DirectionPrimitive,
  Portal as PortalPrimitive,
  Slot as SlotPrimitive,
  VisuallyHidden as VisuallyHiddenPrimitive
} from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, type ReactNode } from 'react';

export const AccessibleIcon = AccessibleIconPrimitive.Root;
export const AccessibleIconRoot = AccessibleIcon;

export type ReadingDirection = 'ltr' | 'rtl';

export type DirectionProviderProps = {
  dir: ReadingDirection;
  children?: ReactNode;
};

export const DirectionProvider = ({ dir, children }: DirectionProviderProps) => (
  <DirectionPrimitive.Provider dir={dir}>{children}</DirectionPrimitive.Provider>
);
export const DirectionProviderRoot = DirectionProvider;

export type PortalProps = ComponentPropsWithoutRef<typeof PortalPrimitive.Root>;

export const Portal = forwardRef<
  ComponentRef<typeof PortalPrimitive.Root>,
  PortalProps
>((props, ref) => <PortalPrimitive.Root ref={ref} {...props} />);

Portal.displayName = 'Portal';
export const PortalRoot = Portal;

export const Slot = forwardRef<
  ComponentRef<typeof SlotPrimitive.Root>,
  SlotProps
>((props, ref) => <SlotPrimitive.Root ref={ref} {...props} />);

Slot.displayName = 'Slot';
export const SlotRoot = Slot;

export type SlotProps = ComponentPropsWithoutRef<typeof SlotPrimitive.Root>;
export type SlottableProps = ComponentPropsWithoutRef<typeof SlotPrimitive.Slottable>;

export const Slottable = ({ children }: SlottableProps) => (
  <SlotPrimitive.Slottable>{children}</SlotPrimitive.Slottable>
);
export const SlotSlottable = Slottable;

export type VisuallyHiddenProps = ComponentPropsWithoutRef<typeof VisuallyHiddenPrimitive.Root>;

export const VisuallyHidden = forwardRef<
  ComponentRef<typeof VisuallyHiddenPrimitive.Root>,
  VisuallyHiddenProps
>((props, ref) => <VisuallyHiddenPrimitive.Root ref={ref} {...props} />);

VisuallyHidden.displayName = 'VisuallyHidden';
export const VisuallyHiddenRoot = VisuallyHidden;
