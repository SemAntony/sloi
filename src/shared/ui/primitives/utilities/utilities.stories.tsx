import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentPropsWithoutRef, useState } from 'react';
import {
  AccessibleIcon,
  DirectionProvider,
  Portal,
  Slot,
  Slottable,
  VisuallyHidden
} from './utilities';
import styles from './utilities.stories.module.scss';

const meta: Meta = {
  title: 'UI/Primitives/Utilities'
};

export default meta;

type Story = StoryObj;

type SlotButtonProps = ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean;
};

const SlotButton = ({ asChild, children, ...props }: SlotButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp className={styles.slotButton} {...props}>
      <Slottable>{children}</Slottable>
    </Comp>
  );
};

export const Default: Story = {
  render: () => (
    <div className={styles.stack}>
      <div className={styles.iconRow}>
        <AccessibleIcon label="Notifications">
          <span aria-hidden className={styles.iconGlyph}>
            [bell]
          </span>
        </AccessibleIcon>
        <span>Icon has explicit accessible label for assistive tech.</span>
      </div>

      <DirectionProvider dir="rtl">
        <div className={styles.rtlBox}>
          RTL direction context
        </div>
      </DirectionProvider>

      <div className={styles.row}>
        <SlotButton>Default button</SlotButton>
        <SlotButton asChild>
          <a href="#">Anchor via Slot</a>
        </SlotButton>
      </div>

      <button className={styles.slotButton}>
        <span aria-hidden className={styles.iconGlyph}>
          [search]
        </span>
        <VisuallyHidden>Search</VisuallyHidden>
      </button>

      <div className={styles.portalHost}>
        <Portal>
          <div className={styles.portalBadge}>
            Portal content
          </div>
        </Portal>
      </div>
    </div>
  )
};

export const AccessibleIconOnly: Story = {
  render: () => (
    <div className={styles.stack}>
      <button className={styles.slotButton} aria-label="Close">
        <AccessibleIcon label="Close">
          <span aria-hidden className={styles.iconGlyph}>
            [x]
          </span>
        </AccessibleIcon>
      </button>
      <p className={styles.meta}>
        Accessible icon has no visual difference, but announces "Close" to screen readers.
      </p>
    </div>
  )
};

export const VisuallyHiddenOnly: Story = {
  render: () => (
    <div className={styles.stack}>
      <div className={styles.slotCard}>
        <button className={styles.slotButton}>
          <span aria-hidden className={styles.iconGlyph}>
            [gear]
          </span>
          <VisuallyHidden>Settings</VisuallyHidden>
        </button>
        <p className={styles.meta}>
          Text is hidden visually but still labels the control for assistive technology users.
        </p>
        <p className={styles.meta}>
          Useful as an alternative to <code>aria-label</code> when you want real text content in
          the DOM.
        </p>
      </div>
    </div>
  )
};

export const DirectionProviderOnly: Story = {
  render: () => (
    <div className={styles.stack}>
      <DirectionProvider dir="ltr">
        <div className={styles.directionCard}>
          <p className={styles.meta}>LTR context</p>
          <div className={styles.directionRow}>
            <span className={styles.directionTag}>Start</span>
            <span className={styles.directionTag}>Middle</span>
            <span className={styles.directionTag}>End</span>
          </div>
        </div>
      </DirectionProvider>

      <DirectionProvider dir="rtl">
        <div className={styles.directionCard}>
          <p className={styles.meta}>RTL context</p>
          <div className={styles.directionRow}>
            <span className={styles.directionTag}>Start</span>
            <span className={styles.directionTag}>Middle</span>
            <span className={styles.directionTag}>End</span>
          </div>
        </div>
      </DirectionProvider>
    </div>
  )
};

export const PortalOnly: Story = {
  render: () => (
    <div className={styles.stack}>
      <p className={styles.meta}>Portal content is rendered outside the local tree (defaults to document.body).</p>
      <div className={styles.portalHost}>
        <Portal>
          <div className={styles.portalBadge}>Global portal badge</div>
        </Portal>
      </div>
    </div>
  )
};

const PortalContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className={styles.portalPanel}>
      <p className={styles.meta}>Portal mounted in this panel via the container prop.</p>
      <Portal container={container}>
        <div className={styles.portalBadgeInPanel}>Panel portal content</div>
      </Portal>
    </div>
  );
};

export const PortalWithCustomContainer: Story = {
  render: () => <PortalContainerPreview />
};

const SlotOnlyPreview = () => {
  const [slotClicks, setSlotClicks] = useState(0);
  const [childClicks, setChildClicks] = useState(0);

  return (
    <div className={styles.stack}>
      <div className={styles.slotCard}>
        <p className={styles.meta}>
          Child handlers run before slot handlers. This child prevents default, so slot logic that
          checks <code>event.defaultPrevented</code> won&apos;t run.
        </p>
        <Slot
          className={styles.slotButton}
          onClick={(event) => {
            if (!event.defaultPrevented) {
              setSlotClicks((count) => count + 1);
            }
          }}
        >
          <button
            className={styles.slotButton}
            onClick={(event) => {
              event.preventDefault();
              setChildClicks((count) => count + 1);
            }}
          >
            Child button
          </button>
        </Slot>
        <p className={styles.meta}>Child clicks: {childClicks} | Slot clicks: {slotClicks}</p>
      </div>

      <div className={styles.slotCard}>
        <p className={styles.meta}>Use Slottable when composing multiple children.</p>
        <Slot className={styles.slotButton}>
          <a href="#" className={styles.inlineAction}>
            <span aria-hidden className={styles.iconGlyph}>
              [L]
            </span>
            <Slottable>Open link</Slottable>
            <span aria-hidden className={styles.iconGlyph}>
              [R]
            </span>
          </a>
        </Slot>
      </div>
    </div>
  );
};

export const SlotOnly: Story = {
  render: () => <SlotOnlyPreview />
};
