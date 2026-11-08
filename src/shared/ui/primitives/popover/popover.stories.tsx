import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../button';
import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger
} from './popover';
import styles from './popover.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Popover',
  component: Popover
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

const PopoverFields = () => (
  <div className={styles.popoverLayout}>
    <p className={styles.heading}>Dimensions</p>
    <label className={styles.fieldset}>
      <span className={styles.label}>Width</span>
      <input className={styles.input} defaultValue="100%" />
    </label>
    <label className={styles.fieldset}>
      <span className={styles.label}>Max width</span>
      <input className={styles.input} defaultValue="320px" />
    </label>
    <label className={styles.fieldset}>
      <span className={styles.label}>Height</span>
      <input className={styles.input} defaultValue="32px" />
    </label>
  </div>
);

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className={styles.iconButton} aria-label="Open dimensions editor" type="button">
          ≡
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent sideOffset={8}>
          <PopoverFields />
          <PopoverClose className={styles.closeButton} aria-label="Close popover">
            ×
          </PopoverClose>
          <PopoverArrow width={12} height={6} />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
};

const ControlledPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.stack}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="secondary">Edit panel</Button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent sideOffset={10} className={styles.controlledContent}>
            <p className={styles.helperText}>Popover is controlled by external React state.</p>
            <Button variant="ghost" onClick={() => setOpen(false)}>Close from inside</Button>
            <PopoverArrow width={12} height={6} />
          </PopoverContent>
        </PopoverPortal>
      </Popover>
      <p className={styles.status}>State: {open ? 'open' : 'closed'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

export const Modal: Story = {
  render: () => (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open modal popover</Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent sideOffset={10} className={styles.controlledContent}>
          <p className={styles.helperText}>
            In modal mode, outside content is inert until the popover is closed.
          </p>
          <PopoverClose className={styles.closeButton}>Close</PopoverClose>
          <PopoverArrow width={12} height={6} />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
};

export const WithCustomAnchor: Story = {
  render: () => (
    <Popover>
      <PopoverAnchor asChild>
        <div className={styles.anchorRow}>
          Row as anchor
          <PopoverTrigger asChild>
            <button className={styles.anchorTrigger} type="button">
              Trigger
            </button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverPortal>
        <PopoverContent sideOffset={8} align="start" className={styles.controlledContent}>
          <p className={styles.helperText}>Content is positioned against the custom anchor row.</p>
          <PopoverArrow width={12} height={6} />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
};

const PopoverContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className={styles.containerPanel}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Render in custom container</Button>
        </PopoverTrigger>
        <PopoverPortal container={container}>
          <PopoverContent sideOffset={10} className={styles.controlledContent}>
            <span className={styles.helperText}>Popover is portaled into this bordered area.</span>
            <PopoverArrow width={12} height={6} />
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: () => <PopoverContainerPreview />
};
