import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../field';
import { NumberField } from './number-field';

const increase = () => screen.getByRole('button', { name: 'Increase value' });
const decrease = () => screen.getByRole('button', { name: 'Decrease value' });

describe('NumberField', () => {
  it('рендерит spinbutton с шагом 1 по умолчанию, пробрасывает ref и атрибуты', () => {
    const ref = createRef<HTMLInputElement>();
    render(<NumberField ref={ref} aria-label='Qty' name='qty' min={1} max={9} />);

    const input = screen.getByRole('spinbutton', { name: 'Qty' });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('step', '1');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '9');
    expect(input).toHaveAttribute('name', 'qty');
  });

  it('className идёт на корневую обёртку, а не на input', () => {
    render(<NumberField aria-label='Qty' className='custom' />);

    const input = screen.getByRole('spinbutton', { name: 'Qty' });
    expect(input).not.toHaveClass('custom');
    expect(input.parentElement).toHaveClass('custom');
  });

  describe('неуправляемый режим', () => {
    it('defaultValue и ввод, onValueChange получает число', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<NumberField aria-label='Qty' defaultValue={5} onValueChange={onValueChange} />);

      const input = screen.getByRole('spinbutton', { name: 'Qty' });
      expect(input).toHaveValue(5);

      await user.type(input, '2');
      expect(input).toHaveValue(52);
      expect(onValueChange).toHaveBeenLastCalledWith(52);
    });

    it('очистка поля даёт undefined и пустое значение', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<NumberField aria-label='Qty' defaultValue={5} onValueChange={onValueChange} />);

      const input = screen.getByRole('spinbutton', { name: 'Qty' });
      await user.clear(input);
      expect(input).toHaveValue(null);
      expect(onValueChange).toHaveBeenLastCalledWith(undefined);
    });

    it('ввод зажимается в границы min и max', () => {
      render(<NumberField aria-label='Qty' defaultValue={5} min={1} max={10} />);

      const input = screen.getByRole('spinbutton', { name: 'Qty' });
      fireEvent.change(input, { target: { value: '150' } });
      expect(input).toHaveValue(10);
      fireEvent.change(input, { target: { value: '-4' } });
      expect(input).toHaveValue(1);
    });

    it('нативный onChange тоже вызывается', () => {
      const onChange = vi.fn();
      render(<NumberField aria-label='Qty' onChange={onChange} />);

      fireEvent.change(screen.getByRole('spinbutton', { name: 'Qty' }), { target: { value: '3' } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('управляемый режим', () => {
    it('значение остаётся за родителем, onValueChange вызывается', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<NumberField aria-label='Qty' value={7} onValueChange={onValueChange} />);

      await user.click(increase());
      expect(onValueChange).toHaveBeenCalledWith(8);
      expect(screen.getByRole('spinbutton', { name: 'Qty' })).toHaveValue(7);
    });

    it('работает как обычный controlled-компонент', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState<number | undefined>(1);
        return <NumberField aria-label='Qty' value={value} onValueChange={setValue} />;
      }
      render(<Controlled />);

      await user.click(increase());
      await user.click(increase());
      expect(screen.getByRole('spinbutton', { name: 'Qty' })).toHaveValue(3);
    });

    it('value={undefined} остаётся управляемым и показывает пустое поле', () => {
      render(<NumberField aria-label='Qty' value={undefined} defaultValue={5} />);

      expect(screen.getByRole('spinbutton', { name: 'Qty' })).toHaveValue(null);
    });
  });

  describe('кнопки шага', () => {
    it('увеличивают и уменьшают на step', async () => {
      const user = userEvent.setup();
      render(<NumberField aria-label='Qty' defaultValue={10} step={5} />);

      const input = screen.getByRole('spinbutton', { name: 'Qty' });
      await user.click(increase());
      expect(input).toHaveValue(15);
      await user.click(decrease());
      await user.click(decrease());
      expect(input).toHaveValue(5);
    });

    it('step можно передать строкой', async () => {
      const user = userEvent.setup();
      render(<NumberField aria-label='Qty' defaultValue={1} step='2' />);

      await user.click(increase());
      expect(screen.getByRole('spinbutton', { name: 'Qty' })).toHaveValue(3);
    });

    it('не выходят за min и max', async () => {
      const user = userEvent.setup();
      render(<NumberField aria-label='Qty' defaultValue={9} min={8} max={10} />);

      const input = screen.getByRole('spinbutton', { name: 'Qty' });
      await user.click(increase());
      await user.click(increase());
      expect(input).toHaveValue(10);
      await user.click(decrease());
      await user.click(decrease());
      await user.click(decrease());
      expect(input).toHaveValue(8);
    });

    it('из пустого поля: увеличение даёт step, уменьшение 0', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<NumberField aria-label='Qty' />);
      await user.click(increase());
      expect(screen.getByRole('spinbutton', { name: 'Qty' })).toHaveValue(1);
      unmount();

      render(<NumberField aria-label='Qty' />);
      await user.click(decrease());
      expect(screen.getByRole('spinbutton', { name: 'Qty' })).toHaveValue(0);
    });

    it('дробный шаг не накапливает ошибку float', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<NumberField aria-label='Qty' defaultValue={0.2} step={0.1} onValueChange={onValueChange} />);

      await user.click(increase());
      expect(onValueChange).toHaveBeenLastCalledWith(0.3);
    });

    it('showStepper={false} скрывает кнопки', () => {
      render(<NumberField aria-label='Qty' showStepper={false} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('отключает поле и обе кнопки, значение не меняется', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<NumberField aria-label='Qty' defaultValue={3} disabled onValueChange={onValueChange} />);

      expect(screen.getByRole('spinbutton', { name: 'Qty' })).toBeDisabled();
      expect(increase()).toBeDisabled();
      expect(decrease()).toBeDisabled();
      await user.click(increase());
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('invalid', () => {
    it('по умолчанию нет aria-invalid и data-invalid', () => {
      render(<NumberField aria-label='Qty' />);

      const input = screen.getByRole('spinbutton', { name: 'Qty' });
      expect(input).not.toHaveAttribute('aria-invalid');
      expect(input.parentElement).not.toHaveAttribute('data-invalid');
    });

    it('invalid ставит aria-invalid на input и data-invalid на корень', () => {
      render(<NumberField aria-label='Qty' invalid />);

      const input = screen.getByRole('spinbutton', { name: 'Qty' });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).not.toHaveAttribute('invalid');
      expect(input.parentElement).toHaveAttribute('data-invalid');
    });

    it('invalid побеждает явный aria-invalid="false"', () => {
      render(<NumberField aria-label='Qty' invalid aria-invalid='false' />);

      expect(screen.getByRole('spinbutton', { name: 'Qty' })).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('внутри Field', () => {
    it('получает имя, описание, invalid, required', () => {
      render(
        <Field label='Quantity' hint='1 to 10' error='Too many' required>
          <NumberField />
        </Field>
      );

      const input = screen.getByRole('spinbutton', { name: 'Quantity' });
      expect(input).toHaveAccessibleDescription('1 to 10 Too many');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('disabled из Field отключает поле и кнопки', () => {
      render(
        <Field label='Quantity' disabled>
          <NumberField />
        </Field>
      );

      expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toBeDisabled();
      expect(increase()).toBeDisabled();
      expect(decrease()).toBeDisabled();
    });
  });

  describe('a11y', () => {
    const options = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } };

    it('нет нарушений: отдельно, в Field, без степпера', async () => {
      const { container } = render(
        <>
          <NumberField aria-label='Standalone' />
          <NumberField aria-label='No stepper' showStepper={false} />
          <Field label='Quantity' hint='Hint' error='Error'>
            <NumberField />
          </Field>
        </>
      );

      expect((await axe(container, options)).violations).toHaveLength(0);
    });
  });
});
