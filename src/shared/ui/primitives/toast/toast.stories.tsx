import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { useEffect, useRef, useState } from 'react';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from './toast';
import styles from './toast.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Toast',
  component: Toast
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

const oneWeekAway = () => {
  const now = new Date();
  now.setDate(now.getDate() + 7);
  return now;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(date);

const ToastPreview = () => {
  const [open, setOpen] = useState(false);
  const [eventDate, setEventDate] = useState(() => new Date());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  return (
    <ToastProvider swipeDirection="right">
      <div className={styles.stack}>
        <button
          type="button"
          className={styles.triggerButton}
          onClick={() => {
            setOpen(false);
            if (timerRef.current !== null) {
              clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
              setEventDate(oneWeekAway());
              setOpen(true);
            }, 100);
          }}
        >
          Add to calendar
        </button>
        <p className={styles.hint}>The toast auto-closes after 5 seconds.</p>
      </div>
      <Toast open={open} onOpenChange={setOpen}>
        <ToastTitle>Scheduled: Catch up</ToastTitle>
        <ToastDescription asChild>
          <time className={styles.date} dateTime={eventDate.toISOString()}>
            {formatDate(eventDate)}
          </time>
        </ToastDescription>
        <ToastAction altText="Go to schedule to undo">Undo</ToastAction>
        <ToastClose aria-label="Close">Close</ToastClose>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export const Default: Story = {
  render: () => <ToastPreview />
};

const BackgroundPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider>
      <div className={styles.stack}>
        <button type="button" className={styles.triggerButton} onClick={() => setOpen(true)}>
          Check for updates
        </button>
        <p className={styles.hint}>Background toasts are announced politely by assistive tech.</p>
      </div>
      <Toast type="background" open={open} onOpenChange={setOpen} duration={4500}>
        <ToastTitle>Update available</ToastTitle>
        <ToastDescription>A newer version of the workspace has been published.</ToastDescription>
        <ToastClose aria-label="Dismiss">Dismiss</ToastClose>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export const BackgroundType: Story = {
  render: () => <BackgroundPreview />,
  play: async ({ canvas, step }) => {
    await step('Open background toast', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Check for updates' }));
      await expect(await canvas.findByText('Update available')).toBeInTheDocument();
    });

    await step('Dismiss background toast', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
      await waitFor(() => {
        expect(canvas.queryByText('Update available')).not.toBeInTheDocument();
      });
    });
  }
};

const CustomHotkeyPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider duration={8000}>
      <div className={styles.stack}>
        <button type="button" className={styles.triggerButton} onClick={() => setOpen(true)}>
          Publish toast
        </button>
        <p className={styles.hint}>Press Alt+T to move focus to the notifications viewport.</p>
      </div>
      <Toast type="foreground" open={open} onOpenChange={setOpen}>
        <ToastTitle>File removed</ToastTitle>
        <ToastDescription>Undo is available with Alt+U.</ToastDescription>
        <ToastAction altText="Undo removal (Alt+U)">Undo</ToastAction>
        <ToastClose aria-label="Close">Close</ToastClose>
      </Toast>
      <ToastViewport hotkey={['altKey', 'KeyT']} label="Notifications (Alt+T)" />
    </ToastProvider>
  );
};

export const CustomHotkey: Story = {
  render: () => <CustomHotkeyPreview />
};

const SwipeUpPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider swipeDirection="up">
      <div className={styles.stack}>
        <button type="button" className={styles.triggerButton} onClick={() => setOpen(true)}>
          Show bottom-left toast
        </button>
        <p className={styles.hint}>Swipe upward (or press Escape) to dismiss.</p>
      </div>
      <Toast open={open} onOpenChange={setOpen} duration={4000}>
        <ToastTitle>Saved</ToastTitle>
        <ToastDescription>Preferences synced across your devices.</ToastDescription>
        <ToastClose aria-label="Close">Close</ToastClose>
      </Toast>
      <ToastViewport className={styles.viewportLeft} />
    </ToastProvider>
  );
};

export const SwipeUp: Story = {
  render: () => <SwipeUpPreview />
};
