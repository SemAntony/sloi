import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './card.module.scss';

export type CardVariant = 'elevated' | 'outlined';
export type CardPadding = 'sm' | 'md' | 'lg';

const variantClassMap: Record<CardVariant, string> = {
  elevated: styles.variantElevated,
  outlined: styles.variantOutlined
};

const paddingClassMap: Record<CardPadding, string> = {
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  padding?: CardPadding;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', padding = 'md', ...props }, ref) => (
    <section
      ref={ref}
      className={cn(styles.root, variantClassMap[variant], paddingClassMap[padding], className)}
      data-variant={variant}
      {...props}
    />
  )
);

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <header ref={ref} className={cn(styles.header, className)} {...props} />
);

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={cn(styles.title, className)} {...props} />
);

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn(styles.description, className)} {...props} />
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(styles.content, className)} {...props} />
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <footer ref={ref} className={cn(styles.footer, className)} {...props} />
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
