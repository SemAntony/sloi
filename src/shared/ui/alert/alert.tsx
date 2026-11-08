import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './alert.module.scss';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

const toneClassMap: Record<AlertTone, string> = {
  info: styles.toneInfo,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  error: styles.toneError
};

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: AlertTone;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone = 'info', title, description, icon, actions, role, children, ...props }, ref) => (
    <div
      ref={ref}
      role={role ?? (tone === 'error' || tone === 'warning' ? 'alert' : 'status')}
      className={cn(styles.root, toneClassMap[tone], className)}
      data-tone={tone}
      {...props}
    >
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <div className={styles.body}>
        {title ? <h4 className={styles.title}>{title}</h4> : null}
        {description ? <p className={styles.description}>{description}</p> : null}
        {children}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  )
);

Alert.displayName = 'Alert';
