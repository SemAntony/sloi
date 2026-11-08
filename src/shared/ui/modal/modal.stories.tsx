import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Modal } from './modal';
import type { ModalProps } from './modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['stable'],
  parameters: {
    pageLayout: 'page'
  },
  args: {
    open: false,
    title: 'Modal title',
    children: 'Modal body content',
    closeButton: true
  }
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalSandbox = (args: Partial<ModalProps>) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        {...args}
        open={open}
        onOpenChange={setOpen}
        onClose={() => setOpen(false)}
        title={args.title}
      >
        {args.children}
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: (args) => <ModalSandbox {...args} />
};

export const States: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <ModalSandbox title='With close button' closeButton>
        Modal with close button
      </ModalSandbox>
      <ModalSandbox title='Without close button' closeButton={false}>
        Modal without close button
      </ModalSandbox>
    </div>
  )
};

const ControlledPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <Button onClick={() => setOpen((prev) => !prev)}>
        Toggle modal externally
      </Button>
      <p>Open: {String(open)}</p>
      <Modal open={open} onOpenChange={setOpen} title='Controlled modal'>
        Controlled state from story.
      </Modal>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

const ModalContainerStory = (args: Partial<ModalProps>) => {
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div
      ref={setContainer}
      style={{
        minHeight: 280,
        border: '1px solid var(--sloi-border-primary)',
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        position: 'relative'
      }}
    >
      <Button onClick={() => setOpen(true)}>Open modal in custom container</Button>
      <Modal
        {...args}
        open={open}
        container={container}
        onOpenChange={setOpen}
        onClose={() => setOpen(false)}
        title={args.title}
      >
        {args.children ?? 'Modal body content'}
      </Modal>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: (args) => <ModalContainerStory {...args} />
};
