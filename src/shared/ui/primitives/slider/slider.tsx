import { Slider as SliderPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './slider.module.scss';

export const Slider = forwardRef<
  ComponentRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root ref={ref} className={cn(styles.sliderRoot, className)} {...props} />
));

Slider.displayName = 'Slider';
export const SliderRoot = Slider;

export const SliderTrack = forwardRef<
  ComponentRef<typeof SliderPrimitive.Track>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Track ref={ref} className={cn(styles.sliderTrack, className)} {...props} />
));

SliderTrack.displayName = 'SliderTrack';

export const SliderRange = forwardRef<
  ComponentRef<typeof SliderPrimitive.Range>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Range>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Range ref={ref} className={cn(styles.sliderRange, className)} {...props} />
));

SliderRange.displayName = 'SliderRange';

export const SliderThumb = forwardRef<
  ComponentRef<typeof SliderPrimitive.Thumb>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb ref={ref} className={cn(styles.sliderThumb, className)} {...props} />
));

SliderThumb.displayName = 'SliderThumb';
