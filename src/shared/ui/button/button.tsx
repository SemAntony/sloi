import {forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode, type Ref} from 'react';
import {cn} from '../../lib/cn/cn';
import {Slot} from '../../lib/radix';
import styles from './button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClassMap: Record<ButtonVariant, string> = {
    primary: styles.variantPrimary,
    secondary: styles.variantSecondary,
    ghost: styles.variantGhost,
    danger: styles.variantDanger
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
    iconOnly?: boolean;
    /** Декоративная иконка перед текстом (`aria-hidden`). Смысловую иконку передавайте в `children`. */
    startIcon?: ReactNode;
    /** Декоративная иконка после текста (`aria-hidden`). */
    endIcon?: ReactNode;
    /**
     * Состояние загрузки: `aria-busy`, спиннер и блокировка кликов. Кнопка остаётся
     * фокусируемой (`aria-disabled`, не `disabled`), чтобы фокус не терялся.
     * При `iconOnly` содержимое скрыто, имя кнопки должно приходить из `aria-label`.
     */
    loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         variant = 'primary',
         size = 'md',
         fullWidth = false,
         asChild = false,
         iconOnly = false,
         loading = false,
         startIcon,
         endIcon,
         className,
         type = 'button',
         onClick,
         children,
         ...props
     }, ref) => {
        const classes = cn(
            styles.root,
            variantClassMap[variant],
            sizeClassMap[size],
            fullWidth && styles.fullWidth,
            iconOnly && styles.iconOnly,
            loading && styles.loading,
            className
        );

        const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
            if (loading) {
                event.preventDefault();
                return;
            }
            onClick?.(event);
        };

        // При loading спиннер занимает место стартовой иконки.
        const start = startIcon && !loading
            ? <span className={styles.icon} aria-hidden='true'>{startIcon}</span>
            : null;
        const end = endIcon
            ? <span className={styles.icon} aria-hidden='true'>{endIcon}</span>
            : null;

        const loadingProps = loading ? {'aria-busy': true, 'aria-disabled': true} : undefined;

        if (asChild) {
            return (
                <Slot.Root ref={ref as unknown as Ref<HTMLElement>}
                           className={classes} {...props} {...loadingProps}
                           onClick={handleClick}>
                    {start}
                    <Slot.Slottable>{children}</Slot.Slottable>
                    {end}
                </Slot.Root>
            );
        }

        return (
            <button ref={ref} className={classes} type={type} {...props} {...loadingProps}
                    onClick={handleClick}>
                {start}
                {children}
                {end}
            </button>
        );
    }
);

Button.displayName = 'Button';
