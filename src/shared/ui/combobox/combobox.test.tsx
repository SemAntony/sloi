import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from './combobox';

const options = [
  { value: 'am', label: 'Armenia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' }
];

describe('Combobox', () => {
  it('filters options and selects a value', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} placeholder='Country' name='country' />);

    const input = screen.getByRole('combobox');
    await user.type(input, 'ger');
    await user.click(screen.getByRole('option', { name: 'Germany' }));

    expect(input).toHaveValue('Germany');
    expect(screen.getByDisplayValue('de')).toHaveAttribute('name', 'country');
  });

  it('calls onValueChange in controlled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSearchValueChange = vi.fn();

    render(
      <Combobox
        options={options}
        value='am'
        searchValue=''
        onValueChange={onValueChange}
        onSearchValueChange={onSearchValueChange}
      />
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'France' }));

    expect(onValueChange).toHaveBeenCalledWith('fr');
  });

  describe('ARIA structure (D11)', () => {
    it('options are direct children of the listbox, without listitem wrappers', async () => {
      const user = userEvent.setup();
      render(<Combobox options={options} aria-label='Country' />);

      await user.click(screen.getByRole('combobox', { name: 'Country' }));

      const listbox = screen.getByRole('listbox');
      const rendered = screen.getAllByRole('option');
      expect(rendered).toHaveLength(options.length);
      for (const option of rendered) {
        expect(option.parentElement).toBe(listbox);
      }
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    it('advertises a listbox popup and does not expose the popup as a dialog', async () => {
      const user = userEvent.setup();
      render(<Combobox options={options} aria-label='Country' />);

      const input = screen.getByRole('combobox', { name: 'Country' });
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');

      await user.click(input);

      expect(input).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('keeps the empty message outside the listbox so that the listbox holds only options', async () => {
      const user = userEvent.setup();
      render(<Combobox options={options} aria-label='Country' emptyMessage='Nothing here' />);

      await user.type(screen.getByRole('combobox', { name: 'Country' }), 'zzz');

      const message = screen.getByText('Nothing here');
      const listbox = screen.getByRole('listbox');
      expect(listbox.contains(message)).toBe(false);
      expect(listbox.children).toHaveLength(0);
    });
  });
});

