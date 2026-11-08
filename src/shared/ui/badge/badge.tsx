import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './badge.module.scss';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeAppearance = 'subtle' | 'solid';
export type BadgeSize = 'sm' | 'md';

const toneClassMap: Record<BadgeTone, string> = {
  neutral: styles.toneNeutral,
  info: styles.toneInfo,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger
};

const appearanceClassMap: Record<BadgeAppearance, string> = {
  subtle: styles.appearanceSubtle,
  solid: styles.appearanceSolid
};

const sizeClassMap: Record<BadgeSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  appearance?: BadgeAppearance;
  size?: BadgeSize;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = 'neutral', appearance = 'subtle', size = 'md', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        styles.root,
        toneClassMap[tone],
        appearanceClassMap[appearance],
        sizeClassMap[size],
        className
      )}
      data-tone={tone}
      {...props}
    />
  )
);

Badge.displayName = 'Badge';
