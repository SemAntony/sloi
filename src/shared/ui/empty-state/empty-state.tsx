import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './empty-state.module.scss';

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, icon, actions, compact = false, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(styles.root, compact && styles.compact, className)}
      role='status'
      {...props}
    >
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </section>
  )
);

EmptyState.displayName = 'EmptyState';
