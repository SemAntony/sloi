import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { FileUploader } from './file-uploader';

describe('FileUploader a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(<FileUploader />);
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
