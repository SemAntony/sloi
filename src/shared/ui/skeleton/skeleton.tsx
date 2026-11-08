import { forwardRef, type HTMLAttributes, type CSSProperties } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './skeleton.module.scss';

export type SkeletonShape = 'text' | 'rect' | 'circle';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  shape?: SkeletonShape;
  animated?: boolean;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shape = 'text', animated = true, width, height, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(styles.root, styles[`shape${shape[0].toUpperCase()}${shape.slice(1)}`], animated && styles.animated, className)}
      style={{ width, height, ...style }}
      aria-hidden
      {...props}
    />
  )
);

Skeleton.displayName = 'Skeleton';
