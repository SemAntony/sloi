import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, DotIcon } from './common';

const glyphs = { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon, CheckIcon, DotIcon };

describe.each(Object.entries(glyphs))('%s', (_name, Glyph) => {
  it('рендерит декоративный svg вместо текстового глифа', () => {
    const { container } = render(<Glyph data-testid='glyph' />);

    const span = container.firstElementChild as HTMLElement;
    expect(span.tagName).toBe('SPAN');
    expect(span).toHaveAttribute('aria-hidden', 'true');
    expect(span.querySelector('svg')).toBeInTheDocument();
    expect(span.textContent).toBe('');
  });

  it('добавляет className к собственному классу и пробрасывает атрибуты', () => {
    const { container } = render(<Glyph className='custom' data-testid='glyph' />);

    const span = container.firstElementChild as HTMLElement;
    expect(span).toHaveClass('custom');
    expect(span.className).toMatch(/glyph/);
    expect(span).toHaveAttribute('data-testid', 'glyph');
  });
});
