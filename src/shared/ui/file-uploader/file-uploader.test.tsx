import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileUploader } from './file-uploader';

describe('FileUploader', () => {
  it('emits selected files from file input', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const { container } = render(<FileUploader onFilesChange={onFilesChange} />);
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeNull();

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    await user.upload(input as HTMLInputElement, file);

    expect(onFilesChange).toHaveBeenCalled();
    const firstCallArg = onFilesChange.mock.calls[0]?.[0] as File[];
    expect(firstCallArg[0]?.name).toBe('hello.txt');
  });

  it('removes uploaded file from list', async () => {
    const user = userEvent.setup();
    render(<FileUploader defaultFiles={[new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' })]} />);

    expect(screen.getByText(/invoice\.pdf/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(screen.queryByText(/invoice\.pdf/i)).not.toBeInTheDocument();
  });
});
