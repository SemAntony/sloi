import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from './select';

const SelectHarness = ({
  defaultValue = 'apple',
  disabledBanana = false
}: {
  defaultValue?: string;
  disabledBanana?: boolean;
}) => (
  <Select defaultValue={defaultValue}>
    <SelectTrigger aria-label='Food'>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectViewport>
        <SelectItem value='apple'>Apple</SelectItem>
        <SelectItem value='banana' disabled={disabledBanana}>Banana</SelectItem>
        <SelectItem value='cherry'>Cherry</SelectItem>
      </SelectViewport>
    </SelectContent>
  </Select>
);

const ControlledSelectHarness = () => {
  const [value, setValue] = useState('apple');

  return (
    <>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger aria-label='Framework'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectViewport>
            <SelectItem value='apple'>Apple</SelectItem>
            <SelectItem value='banana'>Banana</SelectItem>
          </SelectViewport>
        </SelectContent>
      </Select>
      <p>Current value: {value}</p>
    </>
  );
};

describe('Select', () => {
  it('renders selected value in trigger', () => {
    render(<SelectHarness />);

    const trigger = screen.getByRole('combobox', { name: 'Food' });
    expect(trigger).toHaveTextContent('Apple');
  });

  it('calls onValueChange in controlled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select value='apple' onValueChange={onValueChange}>
        <SelectTrigger aria-label='Food'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectViewport>
            <SelectItem value='apple'>Apple</SelectItem>
            <SelectItem value='banana'>Banana</SelectItem>
          </SelectViewport>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole('combobox', { name: 'Food' }));
    await user.click(await screen.findByRole('option', { name: 'Banana' }));

    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('updates value via keyboard-only interaction in uncontrolled mode', async () => {
    const user = userEvent.setup();

    render(<ControlledSelectHarness />);

    const trigger = screen.getByRole('combobox', { name: 'Framework' });
    trigger.focus();

    await user.keyboard('{Enter}');
    expect(await screen.findByRole('option', { name: 'Banana' })).toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(screen.getByText('Current value: banana')).toBeInTheDocument();
  });

  it('keeps disabled item non-selectable', async () => {
    const user = userEvent.setup();

    render(<SelectHarness disabledBanana />);

    const trigger = screen.getByRole('combobox', { name: 'Food' });
    expect(trigger).toHaveTextContent('Apple');

    await user.click(trigger);
    const disabledBanana = await screen.findByRole('option', { name: 'Banana' });
    expect(disabledBanana).toHaveAttribute('aria-disabled', 'true');
    expect(disabledBanana).toHaveAttribute('data-disabled', '');

    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(trigger).toHaveTextContent('Cherry');
  });

  describe('controlled reset (D14)', () => {
    it("value='' shows the placeholder, a value shows the option, and it can be reset back", () => {
      const tree = (value: string) => (
        <Select value={value} onValueChange={() => undefined}>
          <SelectTrigger aria-label='Food'>
            <SelectValue placeholder='Pick a fruit' />
          </SelectTrigger>
          <SelectContent>
            <SelectViewport>
              <SelectItem value='apple'>Apple</SelectItem>
            </SelectViewport>
          </SelectContent>
        </Select>
      );
      const { rerender } = render(tree(''));
      const trigger = screen.getByRole('combobox', { name: 'Food' });
      expect(trigger).toHaveTextContent('Pick a fruit');

      rerender(tree('apple'));
      expect(trigger).toHaveTextContent('Apple');

      rerender(tree(''));
      expect(trigger).toHaveTextContent('Pick a fruit');
    });
  });

  describe('without defaultValue (D14)', () => {
    const renderWithoutDefault = (onValueChange?: (value: string) => void) =>
      render(
        <Select onValueChange={onValueChange}>
          <SelectTrigger aria-label='Food'>
            <SelectValue placeholder='Pick a fruit' />
          </SelectTrigger>
          <SelectContent>
            <SelectViewport>
              <SelectItem value='apple'>Apple</SelectItem>
              <SelectItem value='banana'>Banana</SelectItem>
            </SelectViewport>
          </SelectContent>
        </Select>
      );

    it('shows the placeholder, then the chosen value, and reports the change', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderWithoutDefault(onValueChange);

      const trigger = screen.getByRole('combobox', { name: 'Food' });
      expect(trigger).toHaveTextContent('Pick a fruit');

      trigger.focus();
      await user.keyboard('{Enter}');
      await user.click(await screen.findByRole('option', { name: 'Banana' }));

      expect(trigger).toHaveTextContent('Banana');
      expect(onValueChange).toHaveBeenCalledWith('banana');
    });

    it('does not warn about switching from uncontrolled to controlled', async () => {
      const user = userEvent.setup();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      try {
        renderWithoutDefault();

        screen.getByRole('combobox', { name: 'Food' }).focus();
        await user.keyboard('{Enter}');
        await user.click(await screen.findByRole('option', { name: 'Apple' }));

        const messages = [...warn.mock.calls, ...error.mock.calls].map((call) => String(call[0]));
        expect(messages.filter((message) => /controlled/i.test(message))).toEqual([]);
      } finally {
        warn.mockRestore();
        error.mockRestore();
      }
    });
  });
});
