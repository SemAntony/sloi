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
});
