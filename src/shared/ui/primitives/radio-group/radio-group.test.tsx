import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  it('switches selected item', async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup defaultValue='daily' aria-label='Notifications frequency'>
        <RadioGroupItem value='daily' aria-label='Daily' />
        <RadioGroupItem value='weekly' aria-label='Weekly' />
      </RadioGroup>
    );

    const daily = screen.getByRole('radio', { name: 'Daily' });
    const weekly = screen.getByRole('radio', { name: 'Weekly' });
    expect(daily).toHaveAttribute('aria-checked', 'true');
    expect(weekly).toHaveAttribute('aria-checked', 'false');

    await user.click(weekly);
    expect(daily).toHaveAttribute('aria-checked', 'false');
    expect(weekly).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onValueChange in controlled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup value='daily' onValueChange={onValueChange} aria-label='Controlled frequency'>
        <RadioGroupItem value='daily' aria-label='Daily' />
        <RadioGroupItem value='weekly' aria-label='Weekly' />
      </RadioGroup>
    );

    await user.click(screen.getByRole('radio', { name: 'Weekly' }));
    expect(onValueChange).toHaveBeenCalledWith('weekly');
  });

  it('respects controlled value prop', () => {
    render(
      <RadioGroup value='weekly' onValueChange={() => undefined} aria-label='Controlled value group'>
        <RadioGroupItem value='daily' aria-label='Daily' />
        <RadioGroupItem value='weekly' aria-label='Weekly' />
      </RadioGroup>
    );

    expect(screen.getByRole('radio', { name: 'Weekly' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveAttribute('aria-checked', 'false');
  });

  it('keeps disabled item non-selectable', async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup defaultValue='daily' aria-label='Disabled options group'>
        <RadioGroupItem value='daily' aria-label='Daily' />
        <RadioGroupItem value='weekly' aria-label='Weekly' disabled />
      </RadioGroup>
    );

    const weekly = screen.getByRole('radio', { name: 'Weekly' });
    expect(weekly).toBeDisabled();

    await user.click(weekly);
    expect(weekly).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveAttribute('aria-checked', 'true');
  });

  it('supports horizontal orientation rendering', () => {
    render(
      <RadioGroup defaultValue='daily' orientation='horizontal' aria-label='Horizontal group'>
        <RadioGroupItem value='daily' aria-label='Daily' />
        <RadioGroupItem value='weekly' aria-label='Weekly' />
      </RadioGroup>
    );

    expect(screen.getByRole('radiogroup', { name: 'Horizontal group' })).toHaveAttribute('aria-orientation', 'horizontal');
  });
});
