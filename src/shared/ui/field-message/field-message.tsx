import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './field-message.module.scss';

export type FieldMessageTone = 'default' | 'error' | 'success';

export type FieldMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  tone?: FieldMessageTone;
};

export const FieldMessage = forwardRef<HTMLParagraphElement, FieldMessageProps>(
  ({ className, tone = 'default', role, ...props }, ref) => (
    <p
      ref={ref}
      role={tone === 'error' ? role ?? 'alert' : role}
      className={cn(styles.message, styles[`tone${tone[0].toUpperCase()}${tone.slice(1)}`], className)}
      data-tone={tone}
      {...props}
    />
  )
);

FieldMessage.displayName = 'FieldMessage';
