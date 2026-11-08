import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import { cn } from '../../lib/cn/cn';
import styles from './input-group.module.scss';

type ChildWithClassName = {
  className?: string;
  disabled?: boolean;
  'aria-invalid'?: boolean | 'true' | 'false';
};

export type InputGroupProps = HTMLAttributes<HTMLDivElement> & {
  startElement?: ReactNode;
  endElement?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
};

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, startElement, endElement, children, invalid = false, disabled = false, ...props }, ref) => {
    const control = isValidElement(children)
      ? cloneElement(children as React.ReactElement<ChildWithClassName>, {
          className: cn(styles.control, (children.props as ChildWithClassName).className),
          disabled: (children.props as ChildWithClassName).disabled ?? disabled,
          'aria-invalid': invalid ? true : undefined
        })
      : Children.only(children);

    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        {...props}
      >
        {startElement ? <span className={styles.adornment}>{startElement}</span> : null}
        {control}
        {endElement ? <span className={styles.adornment}>{endElement}</span> : null}
      </div>
    );
  }
);

InputGroup.displayName = 'InputGroup';
