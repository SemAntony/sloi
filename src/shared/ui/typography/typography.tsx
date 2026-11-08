import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn/cn';

export type TypographyVariant =
  | 'display-lg'
  | 'display-md'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption';

export type TypographyTone = 'primary' | 'secondary' | 'muted';
export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TypographyLeading = 'tight' | 'normal' | 'relaxed';

const variantClassMap: Record<TypographyVariant, string> = {
  'display-lg': 'sloi-text-display-lg',
  'display-md': 'sloi-text-display-md',
  'heading-lg': 'sloi-text-heading-lg',
  'heading-md': 'sloi-text-heading-md',
  'heading-sm': 'sloi-text-heading-sm',
  'body-lg': 'sloi-text-body-lg',
  'body-md': 'sloi-text-body-md',
  'body-sm': 'sloi-text-body-sm',
  caption: 'sloi-text-caption'
};

const toneClassMap: Record<TypographyTone, string> = {
  primary: 'sloi-text-primary',
  secondary: 'sloi-text-secondary',
  muted: 'sloi-text-muted'
};

const weightClassMap: Record<TypographyWeight, string> = {
  regular: 'sloi-font-regular',
  medium: 'sloi-font-medium',
  semibold: 'sloi-font-semibold',
  bold: 'sloi-font-bold'
};

const leadingClassMap: Record<TypographyLeading, string> = {
  tight: 'sloi-leading-tight',
  normal: 'sloi-leading-normal',
  relaxed: 'sloi-leading-relaxed'
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TypographyVariant;
  tone?: TypographyTone;
  weight?: TypographyWeight;
  leading?: TypographyLeading;
  truncate?: boolean;
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      as: Component = 'p',
      variant = 'body-md',
      tone = 'primary',
      weight,
      leading,
      truncate = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'sloi-typography',
          variantClassMap[variant],
          toneClassMap[tone],
          weight ? weightClassMap[weight] : undefined,
          leading ? leadingClassMap[leading] : undefined,
          truncate && 'sloi-truncate',
          className
        )}
        {...props}
      />
    );
  }
);

Typography.displayName = 'Typography';
