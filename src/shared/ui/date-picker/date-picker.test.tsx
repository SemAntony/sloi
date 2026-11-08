import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {
  it('serializes single mode value for form submit', () => {
    render(<DatePicker mode='single' name='birthday' value={new Date(2026, 0, 14)} />);

    const input = screen.getByDisplayValue('2026-01-14');
    expect(input).toHaveAttribute('name', 'birthday');
  });

  it('serializes multiple mode values as array fields', () => {
    render(
      <DatePicker
        mode='multiple'
        name='holidays'
        value={[new Date(2026, 4, 10), new Date(2026, 4, 12)]}
      />
    );

    expect(screen.getByDisplayValue('2026-05-10')).toHaveAttribute('name', 'holidays[]');
    expect(screen.getByDisplayValue('2026-05-12')).toHaveAttribute('name', 'holidays[]');
  });

  it('serializes range mode values as from/to fields', () => {
    render(
      <DatePicker
        mode='range'
        name='period'
        value={{ from: new Date(2026, 1, 1), to: new Date(2026, 1, 5) }}
      />
    );

    expect(screen.getByDisplayValue('2026-02-01')).toHaveAttribute('name', 'period[from]');
    expect(screen.getByDisplayValue('2026-02-05')).toHaveAttribute('name', 'period[to]');
  });

  it('opens calendar popover from trigger', async () => {
    const user = userEvent.setup();
    render(<DatePicker mode='single' placeholder='Pick a day' />);

    await user.click(screen.getByRole('button', { name: 'Pick a day' }));
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
