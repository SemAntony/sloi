import type { Meta, StoryObj } from '@storybook/react';
import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import styles from './avatar.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Avatar',
  component: Avatar
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className={styles.row}>
      <Avatar className={styles.avatarMd}>
        <AvatarImage
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <AvatarFallback delayMs={450}>CT</AvatarFallback>
      </Avatar>
      <Avatar className={styles.avatarMd}>
        <AvatarImage src="https://example.invalid/not-found.png" alt="Broken source example" />
        <AvatarFallback delayMs={450}>ER</AvatarFallback>
      </Avatar>
      <Avatar className={styles.avatarMd}>
        <AvatarFallback>PD</AvatarFallback>
      </Avatar>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className={styles.row}>
      <Avatar className={styles.avatarSm}>
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar className={styles.avatarMd}>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className={styles.avatarLg}>
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  )
};

const AvatarStatusPreview = () => {
  const [status, setStatus] = useState('loading');

  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        <Avatar className={styles.avatarLg}>
          <AvatarImage
            src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?w=128&h=128&dpr=2&q=80"
            alt="Pedro Duarte"
            onLoadingStatusChange={(value) => setStatus(value)}
          />
          <AvatarFallback delayMs={600}>PD</AvatarFallback>
        </Avatar>
      </div>
      <p className={styles.status}>Image loading status: {status}</p>
    </div>
  );
};

export const LoadingStatusCallback: Story = {
  render: () => <AvatarStatusPreview />
};

const AvatarButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ className, ...props }, ref) => (
    <button
      type="button"
      ref={ref}
      className={cn(styles.avatarButton, className)}
      {...props}
    />
  )
);

AvatarButton.displayName = 'AvatarButton';

export const AsChild: Story = {
  render: () => (
    <Avatar asChild className={styles.avatarMd}>
      <AvatarButton aria-label="Open user menu">
        <AvatarImage
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <AvatarFallback delayMs={450}>CT</AvatarFallback>
      </AvatarButton>
    </Avatar>
  )
};
