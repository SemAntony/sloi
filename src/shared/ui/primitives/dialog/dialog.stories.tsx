import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor } from '@storybook/test';
import { useState } from 'react';
import { Button } from '../../button';
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from './dialog';
import styles from './dialog.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Dialog',
  component: Dialog
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
          <div className={styles.formGrid}>
            <fieldset className={styles.field}>
              <label className={styles.label} htmlFor="dialog-name">Name</label>
              <input className={styles.input} id="dialog-name" defaultValue="Pedro Duarte" />
            </fieldset>
            <fieldset className={styles.field}>
              <label className={styles.label} htmlFor="dialog-username">Username</label>
              <input className={styles.input} id="dialog-username" defaultValue="@peduarte" />
            </fieldset>
            <div className={styles.footer}>
              <DialogClose asChild>
                <Button>Save changes</Button>
              </DialogClose>
            </div>
          </div>
          <DialogCloseButton />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('button', { name: 'Edit profile' });

    await step('Open dialog from trigger', async () => {
      await userEvent.click(trigger);
      await expect(await screen.findByRole('dialog')).toBeInTheDocument();
    });

    await step('Close dialog through primary action and restore focus', async () => {
      await userEvent.click(await screen.findByRole('button', { name: 'Save changes' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      await expect(trigger).toHaveFocus();
    });
  }
};

const wait = () => new Promise((resolve) => setTimeout(resolve, 900));

const AsyncControlledPreview = () => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Open async dialog</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Archive project</DialogTitle>
          <DialogDescription>Dialog closes only after async action is complete.</DialogDescription>
          <form
            className={styles.formGrid}
            onSubmit={(event) => {
              event.preventDefault();
              setSaving(true);
              wait().then(() => {
                setSaving(false);
                setOpen(false);
              });
            }}
          >
            <div className={styles.footer}>
              <DialogClose asChild>
                <Button variant="ghost" disabled={saving}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </div>
          </form>
          <DialogCloseButton disabled={saving} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export const AsyncControlled: Story = {
  render: () => <AsyncControlledPreview />
};

const DialogContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className={styles.containerPanel}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Open in custom container</Button>
        </DialogTrigger>
        <DialogPortal container={container}>
          <DialogOverlay className={styles.localOverlay} />
          <DialogContent className={styles.localContent}>
            <DialogTitle>Local container dialog</DialogTitle>
            <DialogDescription>Portal target is scoped to this panel.</DialogDescription>
            <div className={styles.footer}>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
            <DialogCloseButton />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: () => <DialogContainerPreview />
};

const NonModalPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.formGrid}>
      <Dialog modal={false} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">Open non-modal dialog</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent>
            <DialogTitle>Non-modal dialog</DialogTitle>
            <DialogDescription>
              Interaction with background remains available when dialog is open.
            </DialogDescription>
            <div className={styles.footer}>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
            <DialogCloseButton />
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <p className={styles.status}>State: {open ? 'open' : 'closed'}</p>
    </div>
  );
};

export const NonModal: Story = {
  render: () => <NonModalPreview />
};
