import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
} from './alert-dialog';

const meta: Meta = {
  title: 'UI/Primitives/AlertDialog'
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will remove related records.
          </AlertDialogDescription>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  )
};

const AlertDialogContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div
      ref={setContainer}
      style={{
        minHeight: 260,
        width: 420,
        border: '1px solid var(--sloi-border-primary)',
        borderRadius: 12,
        position: 'relative',
        display: 'grid',
        placeItems: 'center'
      }}
    >
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">Delete in local container</Button>
        </AlertDialogTrigger>
        <AlertDialogPortal container={container}>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>Portal is scoped to this local panel.</AlertDialogDescription>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: () => <AlertDialogContainerPreview />
};

const wait = () => new Promise((resolve) => setTimeout(resolve, 900));

const AsyncControlledPreview = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Archive project</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogTitle>Archive this project?</AlertDialogTitle>
          <AlertDialogDescription>
            The project will be moved to archive and can be restored later.
          </AlertDialogDescription>
          <form
            style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitting(true);
              wait().then(() => {
                setSubmitting(false);
                setOpen(false);
              });
            }}
          >
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={submitting}>
              {submitting ? 'Archiving…' : 'Archive'}
            </AlertDialogAction>
          </form>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export const AsyncControlled: Story = {
  render: () => <AsyncControlledPreview />
};
