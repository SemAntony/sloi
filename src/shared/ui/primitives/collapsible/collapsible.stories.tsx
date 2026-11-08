import type { Meta, StoryObj } from '@storybook/react';
import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon
} from './collapsible';
import styles from './collapsible.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Collapsible',
  component: Collapsible
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible defaultOpen className={styles.demoRoot}>
      <div className={styles.headerRow}>
        <span className={styles.heading}>@peduarte starred 3 repositories</span>
        <CollapsibleTrigger className={styles.iconTrigger} aria-label="Toggle repositories" />
      </div>

      <div className={styles.repository}>@radix-ui/primitives</div>

      <CollapsibleContent>
        <div className={styles.contentStack}>
          <div className={styles.repository}>@radix-ui/colors</div>
          <div className={styles.repository}>@radix-ui/themes</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
};

const ControlledPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.demoRoot}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className={styles.headerRow}>
          <span className={styles.heading}>Project details</span>
          <CollapsibleTrigger>{open ? 'Hide details' : 'Show details'}</CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className={styles.contentStack}>
            <div className={styles.repository}>Build target: React 18/19 + Next.js support</div>
            <div className={styles.repository}>Rendering: SSR-safe wrappers over Radix primitives</div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <p className={styles.status}>Current state: {open ? 'open' : 'closed'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

const TriggerButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      {...props}
    >
      {children}
      <CollapsibleTriggerIcon />
    </button>
  )
);

TriggerButton.displayName = 'TriggerButton';

export const AsChildTrigger: Story = {
  render: () => (
    <Collapsible className={styles.demoRoot}>
      <CollapsibleTrigger asChild className={styles.asChildTrigger}>
        <TriggerButton>Compose with custom trigger</TriggerButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className={styles.contentStack}>
          <div className={styles.repository}>`asChild` keeps Radix behavior and accessibility.</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
};

export const Disabled: Story = {
  render: () => (
    <Collapsible disabled className={styles.demoRoot}>
      <div className={styles.headerRow}>
        <span className={styles.heading}>Disabled collapsible</span>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className={styles.contentStack}>
          <div className={styles.repository}>This section is not interactive while disabled.</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
};
