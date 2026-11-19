import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../field';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('рендерит textarea с 4 строками по умолчанию, rows переопределяется', () => {
    const { rerender } = render(<Textarea aria-label='Bio' />);
    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('rows', '4');

    rerender(<Textarea aria-label='Bio' rows={8} />);
    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('rows', '8');
  });

  it('пробрасывает ref на нативный элемент и нативные атрибуты', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label='Bio' placeholder='Tell us' maxLength={50} name='bio' />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(ref.current).toBe(textarea);
    expect(textarea).toHaveAttribute('placeholder', 'Tell us');
    expect(textarea).toHaveAttribute('maxlength', '50');
    expect(textarea).toHaveAttribute('name', 'bio');
  });

  it('добавляет className к собственному классу, а не заменяет его', () => {
    render(<Textarea aria-label='Bio' className='custom' />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(textarea).toHaveClass('custom');
    expect(textarea.className).toMatch(/textarea/);
  });

  it('неуправляемый режим: defaultValue и ввод', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label='Bio' defaultValue='Hi' />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(textarea).toHaveValue('Hi');
    await user.type(textarea, ' there');
    expect(textarea).toHaveValue('Hi there');
  });

  it('управляемый режим: onChange получает ввод, значение остаётся за родителем', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label='Bio' value='Fixed' onChange={onChange} />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    await user.type(textarea, 'x');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('Fixed');
  });

  it('disabled и readOnly', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <Textarea aria-label='Off' disabled onChange={onChange} />
        <Textarea aria-label='Read' readOnly defaultValue='Locked' onChange={onChange} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Off' })).toBeDisabled();
    await user.type(screen.getByRole('textbox', { name: 'Read' }), 'x');
    expect(screen.getByRole('textbox', { name: 'Read' })).toHaveValue('Locked');
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('invalid', () => {
    it('по умолчанию не добавляет aria-invalid и data-invalid', () => {
      render(<Textarea aria-label='Bio' />);

      const textarea = screen.getByRole('textbox', { name: 'Bio' });
      expect(textarea).not.toHaveAttribute('aria-invalid');
      expect(textarea).not.toHaveAttribute('data-invalid');
    });

    it('invalid ставит aria-invalid и data-invalid', () => {
      render(<Textarea aria-label='Bio' invalid />);

      const textarea = screen.getByRole('textbox', { name: 'Bio' });
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('data-invalid');
    });

    it('invalid не попадает в DOM как атрибут', () => {
      render(<Textarea aria-label='Bio' invalid />);

      expect(screen.getByRole('textbox', { name: 'Bio' })).not.toHaveAttribute('invalid');
    });

    it('invalid побеждает явный aria-invalid="false"', () => {
      render(<Textarea aria-label='Bio' invalid aria-invalid='false' />);

      expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('aria-invalid', 'true');
    });

    it('явный aria-invalid без invalid сохраняется', () => {
      render(<Textarea aria-label='Bio' aria-invalid='true' />);

      expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('внутри Field', () => {
    it('получает имя, описание и invalid от Field', () => {
      render(
        <Field label='Bio' hint='Max 200 chars' error='Too short'>
          <Textarea />
        </Field>
      );

      const textarea = screen.getByRole('textbox', { name: 'Bio' });
      expect(textarea).toHaveAccessibleDescription('Max 200 chars Too short');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('data-invalid');
    });

    it('required и disabled приходят от Field', () => {
      render(
        <>
          <Field label='Required' required>
            <Textarea />
          </Field>
          <Field label='Disabled' disabled>
            <Textarea />
          </Field>
        </>
      );

      expect(screen.getByRole('textbox', { name: 'Required' })).toHaveAttribute('aria-required', 'true');
      expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
    });

    it('свой aria-describedby склеивается с описанием Field', () => {
      render(
        <>
          <p id='counter'>0 / 200</p>
          <Field label='Bio' hint='Hint'>
            <Textarea aria-describedby='counter' />
          </Field>
        </>
      );

      expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAccessibleDescription('0 / 200 Hint');
    });
  });

  describe('a11y', () => {
    const options = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } };

    it('нет нарушений: с aria-label, в Field, в состоянии ошибки', async () => {
      const { container } = render(
        <>
          <Textarea aria-label='Standalone' />
          <Field label='Bio' hint='Hint' error='Error' required>
            <Textarea />
          </Field>
        </>
      );

      expect((await axe(container, options)).violations).toHaveLength(0);
    });
  });
});
