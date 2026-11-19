import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../field';
import { SearchInput } from './search-input';

const clearButton = () => screen.getByRole('button', { name: 'Clear search' });

describe('SearchInput', () => {
  it('рендерит searchbox с placeholder "Search" по умолчанию, пробрасывает ref и атрибуты', () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} aria-label='Find' name='q' />);

    const input = screen.getByRole('searchbox', { name: 'Find' });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute('placeholder', 'Search');
    expect(input).toHaveAttribute('name', 'q');
  });

  it('className идёт на корень, а не на input', () => {
    render(<SearchInput aria-label='Find' className='custom' />);

    const input = screen.getByRole('searchbox', { name: 'Find' });
    expect(input).not.toHaveClass('custom');
    expect(input.parentElement).toHaveClass('custom');
  });

  describe('неуправляемый режим', () => {
    it('defaultValue и ввод, onValueChange и onChange вызываются', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onChange = vi.fn();
      render(<SearchInput aria-label='Find' defaultValue='re' onValueChange={onValueChange} onChange={onChange} />);

      const input = screen.getByRole('searchbox', { name: 'Find' });
      expect(input).toHaveValue('re');
      await user.type(input, 'act');
      expect(input).toHaveValue('react');
      expect(onValueChange).toHaveBeenLastCalledWith('react');
      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('управляемый режим', () => {
    it('значение остаётся за родителем', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<SearchInput aria-label='Find' value='ab' onValueChange={onValueChange} />);

      const input = screen.getByRole('searchbox', { name: 'Find' });
      await user.type(input, 'c');
      expect(onValueChange).toHaveBeenCalledWith('abc');
      expect(input).toHaveValue('ab');
    });

    it('работает как обычный controlled-компонент', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState('');
        return <SearchInput aria-label='Find' value={value} onValueChange={setValue} />;
      }
      render(<Controlled />);

      const input = screen.getByRole('searchbox', { name: 'Find' });
      await user.type(input, 'hi');
      expect(input).toHaveValue('hi');
    });

    it('value={undefined} остаётся управляемым и показывает пустое поле', () => {
      render(<SearchInput aria-label='Find' value={undefined} defaultValue='x' />);

      expect(screen.getByRole('searchbox', { name: 'Find' })).toHaveValue('');
    });
  });

  describe('очистка', () => {
    it('кнопка Clear отключена при пустом поле и включена при значении', async () => {
      const user = userEvent.setup();
      render(<SearchInput aria-label='Find' />);

      expect(clearButton()).toBeDisabled();
      await user.type(screen.getByRole('searchbox', { name: 'Find' }), 'a');
      expect(clearButton()).toBeEnabled();
    });

    it('клик по Clear очищает поле, вызывает onValueChange("") и onClear', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onClear = vi.fn();
      render(<SearchInput aria-label='Find' defaultValue='query' onValueChange={onValueChange} onClear={onClear} />);

      await user.click(clearButton());
      expect(screen.getByRole('searchbox', { name: 'Find' })).toHaveValue('');
      expect(onValueChange).toHaveBeenLastCalledWith('');
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('Escape очищает непустое поле', async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(<SearchInput aria-label='Find' defaultValue='query' onClear={onClear} />);

      await user.type(screen.getByRole('searchbox', { name: 'Find' }), '{Escape}');
      expect(screen.getByRole('searchbox', { name: 'Find' })).toHaveValue('');
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('Escape на пустом поле ничего не вызывает', async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      const onValueChange = vi.fn();
      render(<SearchInput aria-label='Find' onClear={onClear} onValueChange={onValueChange} />);

      await user.type(screen.getByRole('searchbox', { name: 'Find' }), '{Escape}');
      expect(onClear).not.toHaveBeenCalled();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('очистка в управляемом режиме только сообщает родителю', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<SearchInput aria-label='Find' value='query' onValueChange={onValueChange} />);

      await user.click(clearButton());
      expect(onValueChange).toHaveBeenCalledWith('');
      expect(screen.getByRole('searchbox', { name: 'Find' })).toHaveValue('query');
    });

    it('пользовательский onKeyDown вызывается вместе со встроенным', async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();
      render(<SearchInput aria-label='Find' defaultValue='q' onKeyDown={onKeyDown} />);

      await user.type(screen.getByRole('searchbox', { name: 'Find' }), '{Escape}');
      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('searchbox', { name: 'Find' })).toHaveValue('');
    });
  });

  describe('disabled', () => {
    it('отключает поле и кнопку очистки', () => {
      render(<SearchInput aria-label='Find' defaultValue='q' disabled />);

      expect(screen.getByRole('searchbox', { name: 'Find' })).toBeDisabled();
      expect(clearButton()).toBeDisabled();
    });
  });

  describe('invalid', () => {
    it('по умолчанию нет aria-invalid и data-invalid', () => {
      render(<SearchInput aria-label='Find' />);

      const input = screen.getByRole('searchbox', { name: 'Find' });
      expect(input).not.toHaveAttribute('aria-invalid');
      expect(input.parentElement).not.toHaveAttribute('data-invalid');
    });

    it('invalid ставит aria-invalid на input и data-invalid на корень', () => {
      render(<SearchInput aria-label='Find' invalid />);

      const input = screen.getByRole('searchbox', { name: 'Find' });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).not.toHaveAttribute('invalid');
      expect(input.parentElement).toHaveAttribute('data-invalid');
    });

    it('invalid побеждает явный aria-invalid="false"', () => {
      render(<SearchInput aria-label='Find' invalid aria-invalid='false' />);

      expect(screen.getByRole('searchbox', { name: 'Find' })).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('внутри Field', () => {
    it('получает имя, описание, invalid, required', () => {
      render(
        <Field label='Find' hint='Search by name' error='Nothing found' required>
          <SearchInput />
        </Field>
      );

      const input = screen.getByRole('searchbox', { name: 'Find' });
      expect(input).toHaveAccessibleDescription('Search by name Nothing found');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('disabled из Field отключает поле и кнопку очистки', () => {
      render(
        <Field label='Find' disabled>
          <SearchInput />
        </Field>
      );

      expect(screen.getByRole('searchbox', { name: 'Find' })).toBeDisabled();
      expect(clearButton()).toBeDisabled();
    });
  });

  describe('a11y', () => {
    const options = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } };

    it('нет нарушений: отдельно и в Field с ошибкой', async () => {
      const { container } = render(
        <>
          <SearchInput aria-label='Standalone' defaultValue='q' />
          <Field label='Find' hint='Hint' error='Error'>
            <SearchInput />
          </Field>
        </>
      );

      expect((await axe(container, options)).violations).toHaveLength(0);
    });
  });
});
