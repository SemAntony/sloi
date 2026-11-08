import { forwardRef, type SVGProps } from 'react';
import { type LucideIcon } from 'lucide-react';
import { AccessibleIcon } from '../primitives/utilities';
import { cn } from '../../lib/cn/cn';
import styles from './icon.module.scss';

export type IconSize = 'sm' | 'md' | 'lg';
export type IconTone =
  | 'current'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24
};

const sizeClassMap: Record<IconSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg
};

const toneClassMap: Record<IconTone, string> = {
  current: styles.toneCurrent,
  primary: styles.tonePrimary,
  secondary: styles.toneSecondary,
  muted: styles.toneMuted,
  info: styles.toneInfo,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger
};

type DecorativeIconProps = {
  decorative?: true;
  label?: never;
};

type LabeledIconProps = {
  decorative: false;
  label: string;
};

type IconBaseProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  icon: LucideIcon;
  size?: IconSize;
  tone?: IconTone;
};

export type IconProps = IconBaseProps & (DecorativeIconProps | LabeledIconProps);

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon: IconGlyph,
      size = 'md',
      tone = 'current',
      decorative = true,
      label,
      className,
      strokeWidth = 1.8,
      ...props
    },
    ref
  ) => {
    if (!decorative && !label) {
      // Runtime safety for non-TypeScript consumers.
      console.error('Icon: `label` is required when `decorative` is false.');
    }

    const iconNode = (
      <IconGlyph
        ref={ref}
        size={sizeMap[size]}
        strokeWidth={strokeWidth}
        className={cn(styles.root, sizeClassMap[size], toneClassMap[tone], className)}
        data-size={size}
        data-tone={tone}
        {...(decorative ? { 'aria-hidden': true, focusable: false } : {})}
        {...props}
      />
    );

    if (decorative) {
      return iconNode;
    }

    return <AccessibleIcon label={label ?? ''}>{iconNode}</AccessibleIcon>;
  }
);

Icon.displayName = 'Icon';
