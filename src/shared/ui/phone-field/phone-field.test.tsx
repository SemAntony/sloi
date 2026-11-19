import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../field';
import { PhoneField } from './phone-field';

describe('PhoneField', () => {
  it('рендерит tel-поле с inputMode, autoComplete и placeholder по умолчанию', () => {
    render(<PhoneField aria-label='Phone' />);

    const input = screen.getByRole('textbox', { name: 'Phone' });
    expect(input).toHaveAttribute('type', 'tel');
    expect(input).toHaveAttribute('inputmode', 'tel');
    expect(input).toHaveAttribute('autocomplete', 'tel');
    expect(input).toHaveAttribute('placeholder', '+1 (555) 123-4567');
  });

  it('placeholder и autoComplete переопределяются', () => {
    render(<PhoneField aria-label='Phone' placeholder='+374 00 000000' autoComplete='off' />);

    const input = screen.getByRole('textbox', { name: 'Phone' });
    expect(input).toHaveAttribute('placeholder', '+374 00 000000');
    expect(input).toHaveAttribute('autocomplete', 'off');
  });

  it('пробрасывает ref и нативные атрибуты, className на input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<PhoneField ref={ref} aria-label='Phone' name='phone' className='custom' />);

    const input = screen.getByRole('textbox', { name: 'Phone' });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('name', 'phone');
    expect(input).toHaveClass('custom');
    expect(input.className).toMatch(/phoneField/);
  });

  describe('неуправляемый режим', () => {
    it('defaultValue и ввод, onValueChange получает строку, onChange тоже вызывается', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onChange = vi.fn();
      render(<PhoneField aria-label='Phone' defaultValue='+1' onValueChange={onValueChange} onChange={onChange} />);

      const input = screen.getByRole('textbox', { name: 'Phone' });
      expect(input).toHaveValue('+1');
      await user.type(input, '55');
      expect(input).toHaveValue('+155');
      expect(onValueChange).toHaveBeenLastCalledWith('+155');
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('без defaultValue поле пустое', () => {
      render(<PhoneField aria-label='Phone' />);

      expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveValue('');
    });
  });

  describe('управляемый режим', () => {
    it('значение остаётся за родителем', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<PhoneField aria-label='Phone' value='+1' onValueChange={onValueChange} />);

      const input = screen.getByRole('textbox', { name: 'Phone' });
      await user.type(input, '5');
      expect(onValueChange).toHaveBeenCalledWith('+15');
      expect(input).toHaveValue('+1');
    });

    it('работает как обычный controlled-компонент', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState('');
        return <PhoneField aria-label='Phone' value={value} onValueChange={setValue} />;
      }
      render(<Controlled />);

      const input = screen.getByRole('textbox', { name: 'Phone' });
      await user.type(input, '12');
      expect(input).toHaveValue('12');
    });

    it('value={undefined} остаётся управляемым и показывает пустое поле', () => {
      render(<PhoneField aria-label='Phone' value={undefined} defaultValue='+1' />);

      expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveValue('');
    });
  });

  it('disabled и readOnly', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <>
        <PhoneField aria-label='Off' disabled onValueChange={onValueChange} />
        <PhoneField aria-label='Read' readOnly defaultValue='+1' onValueChange={onValueChange} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Off' })).toBeDisabled();
    await user.type(screen.getByRole('textbox', { name: 'Read' }), '5');
    expect(screen.getByRole('textbox', { name: 'Read' })).toHaveValue('+1');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  describe('invalid', () => {
    it('по умолчанию нет aria-invalid и data-invalid', () => {
      render(<PhoneField aria-label='Phone' />);

      const input = screen.getByRole('textbox', { name: 'Phone' });
      expect(input).not.toHaveAttribute('aria-invalid');
      expect(input).not.toHaveAttribute('data-invalid');
    });

    it('invalid ставит aria-invalid и data-invalid и не попадает в DOM как атрибут', () => {
      render(<PhoneField aria-label='Phone' invalid />);

      const input = screen.getByRole('textbox', { name: 'Phone' });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('data-invalid');
      expect(input).not.toHaveAttribute('invalid');
    });

    it('invalid побеждает явный aria-invalid="false"', () => {
      render(<PhoneField aria-label='Phone' invalid aria-invalid='false' />);

      expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('внутри Field', () => {
    it('получает имя, описание, invalid, required', () => {
      render(
        <Field label='Phone' hint='With country code' error='Bad number' required>
          <PhoneField />
        </Field>
      );

      const input = screen.getByRole('textbox', { name: 'Phone' });
      expect(input).toHaveAccessibleDescription('With country code Bad number');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('disabled из Field отключает поле', () => {
      render(
        <Field label='Phone' disabled>
          <PhoneField />
        </Field>
      );

      expect(screen.getByRole('textbox', { name: 'Phone' })).toBeDisabled();
    });
  });

  describe('a11y', () => {
    const options = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } };

    it('нет нарушений: отдельно и в Field с ошибкой', async () => {
      const { container } = render(
        <>
          <PhoneField aria-label='Standalone' />
          <Field label='Phone' hint='Hint' error='Error'>
            <PhoneField />
          </Field>
        </>
      );

      expect((await axe(container, options)).violations).toHaveLength(0);
    });
  });
});
