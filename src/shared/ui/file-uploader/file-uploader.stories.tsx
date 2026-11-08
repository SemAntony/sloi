import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { FileUploader } from './file-uploader';
import styles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/FileUploader',
  component: FileUploader
} satisfies Meta<typeof FileUploader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    multiple: true,
    maxFiles: 4,
    maxFileSize: 2 * 1024 * 1024,
    emptyHint: 'Drop files here or click to upload.'
  }
};

export const States: Story = {
  render: () => (
    <div className={styles.stack} style={{ width: '100%' }}>
      <FileUploader />
      <FileUploader disabled defaultFiles={[new File(['demo'], 'readme.txt', { type: 'text/plain' })]} />
      <FileUploader multiple maxFiles={2} maxFileSize={1024 * 1024} accept='.pdf,.docx' />
    </div>
  )
};

const ControlledPreview = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className={styles.stack} style={{ width: '100%' }}>
      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
        <Button
          size='sm'
          variant='secondary'
          onClick={() => setFiles([new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' })])}
        >
          Add demo file
        </Button>
        <Button size='sm' variant='ghost' onClick={() => setFiles([])}>
          Clear
        </Button>
      </div>
      <FileUploader files={files} onFilesChange={setFiles} multiple />
      <p className={styles.meta}>Controlled files: {files.length}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
