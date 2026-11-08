import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../button';
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger
} from './hover-card';
import styles from './hover-card.stories.module.scss';

const meta = {
  title: 'UI/Primitives/HoverCard',
  component: HoverCard
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const ProfileCard = ({ followers = '2,900' }: { followers?: string }) => (
  <div className={styles.profileCard}>
    <img
      className={styles.profileAvatar}
      src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
      alt="Radix UI"
    />

    <div className={styles.profileMeta}>
      <div className={styles.profileHeader}>
        <strong className={styles.profileName}>Radix</strong>
        <span className={styles.profileHandle}>@radix_ui</span>
      </div>

      <p className={styles.profileBio}>
        Components, icons, colors, and templates for building high-quality, accessible UI.
      </p>

      <div className={styles.profileStats}>
        <span><strong>0</strong> Following</span>
        <span><strong>{followers}</strong> Followers</span>
      </div>
    </div>
  </div>
);

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          className={styles.profileTrigger}
          href="https://twitter.com/radix_ui"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            className={styles.profileTriggerAvatar}
            src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
            alt="Radix UI"
          />
          <span className={styles.profileTriggerText}>@radix_ui</span>
        </a>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent sideOffset={6}>
          <ProfileCard />
          <HoverCardArrow width={12} height={6} />
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  )
};

const ControlledPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.stack}>
      <HoverCard open={open} onOpenChange={setOpen}>
        <HoverCardTrigger asChild>
          <Button variant="ghost">@sloi-ui</Button>
        </HoverCardTrigger>
        <HoverCardPortal>
          <HoverCardContent>
            <ProfileCard followers="3,412" />
            <HoverCardArrow width={12} height={6} />
          </HoverCardContent>
        </HoverCardPortal>
      </HoverCard>

      <div className={styles.controlsRow}>
        <Button variant="secondary" onClick={() => setOpen((prev) => !prev)}>
          Toggle programmatically
        </Button>
        <span className={styles.status}>State: {open ? 'open' : 'closed'}</span>
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

export const InstantOpen: Story = {
  render: () => (
    <HoverCard openDelay={0} closeDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="ghost">Hover instantly</Button>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent sideOffset={10} className={styles.constrainedContent}>
          <p className={styles.instantText}>
            This preview opens immediately and is constrained by trigger width and viewport height.
          </p>
          <HoverCardArrow width={12} height={6} />
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  )
};

const CustomContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className={styles.containerPanel}>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost">Scoped portal</Button>
        </HoverCardTrigger>
        <HoverCardPortal container={container}>
          <HoverCardContent side="right" align="start" sideOffset={8}>
            <p className={styles.instantText}>
              HoverCard portal is rendered into this bordered panel container.
            </p>
            <HoverCardArrow width={12} height={6} />
          </HoverCardContent>
        </HoverCardPortal>
      </HoverCard>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: () => <CustomContainerPreview />
};
