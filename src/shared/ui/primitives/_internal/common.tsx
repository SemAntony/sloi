import type { ComponentProps, HTMLAttributes } from 'react';
import { cn } from '../../../lib/cn/cn';
import { Icon, IconCheck, IconChevronDown, IconChevronRight, IconChevronUp } from '../../icon';
import styles from './common.module.scss';

type GlyphProps = HTMLAttributes<HTMLSpanElement>;
type IconGlyph = ComponentProps<typeof Icon>['icon'];

/**
 * Декоративная иконка-индикатор для примитивов. Размер задаётся через `font-size`
 * родителя (svg = 1em), как у прежнего текстового глифа, поэтому существующие стили
 * `.chevron`/`.checkIcon` продолжают работать.
 */
const createGlyph = (icon: IconGlyph, displayName: string) => {
  const Glyph = ({ className, ...props }: GlyphProps) => (
    <span aria-hidden {...props} className={cn(styles.glyph, className)}>
      <Icon icon={icon} />
    </span>
  );
  Glyph.displayName = displayName;
  return Glyph;
};

/** Точки нет в курируемом наборе иконок, поэтому это простой svg-круг без lucide. */
export const DotIcon = ({ className, ...props }: GlyphProps) => (
  <span aria-hidden {...props} className={cn(styles.glyph, className)}>
    <svg viewBox='0 0 8 8' focusable='false'>
      <circle cx='4' cy='4' r='2' fill='currentColor' />
    </svg>
  </span>
);

export const ChevronDownIcon = createGlyph(IconChevronDown, 'ChevronDownIcon');
export const ChevronUpIcon = createGlyph(IconChevronUp, 'ChevronUpIcon');
export const ChevronRightIcon = createGlyph(IconChevronRight, 'ChevronRightIcon');
export const CheckIcon = createGlyph(IconCheck, 'CheckIcon');
