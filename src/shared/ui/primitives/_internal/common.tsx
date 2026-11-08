import type { HTMLAttributes } from 'react';

export const ChevronDownIcon = (props: HTMLAttributes<HTMLSpanElement>) => (
  <span aria-hidden {...props}>
    ▾
  </span>
);

export const ChevronUpIcon = (props: HTMLAttributes<HTMLSpanElement>) => (
  <span aria-hidden {...props}>
    ▴
  </span>
);

export const ChevronRightIcon = (props: HTMLAttributes<HTMLSpanElement>) => (
  <span aria-hidden {...props}>
    ▸
  </span>
);

export const CheckIcon = (props: HTMLAttributes<HTMLSpanElement>) => (
  <span aria-hidden {...props}>
    ✓
  </span>
);

export const DotIcon = (props: HTMLAttributes<HTMLSpanElement>) => (
  <span aria-hidden {...props}>
    •
  </span>
);
