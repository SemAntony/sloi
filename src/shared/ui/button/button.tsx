import { forwardRef, type ButtonHTMLAttributes, type Ref } from 'react';
import { cn } from '../../lib/cn/cn';
import { Slot } from '../../lib/radix';
import styles from './button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClassMap: Record<ButtonVariant, string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  ghost: styles.variantGhost
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    asChild = false,
    className,
    type = 'button',
    ...props
  }, ref) => {
    const classes = cn(
      styles.root,
      variantClassMap[variant],
      sizeClassMap[size],
      fullWidth && styles.fullWidth,
      className
    );

    if (asChild) {
      return <Slot.Root ref={ref as unknown as Ref<HTMLElement>} className={classes} {...props} />;
    }

    return <button ref={ref} className={classes} type={type} {...props} />;
  }
);

Button.displayName = 'Button';
