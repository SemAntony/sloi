import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Input } from './input';

const ControlledInputHarness = () => {
  const [value, setValue] = useState('start');

  return (
    <>
      <Input
        aria-label='Controlled input'
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
      <p>Current value: {value}</p>
    </>
  );
};

describe('Input', () => {
  it('marks invalid state through aria-invalid', () => {
    render(<Input aria-label='Email' invalid />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('uses text as default input type', () => {
    render(<Input aria-label='Username' />);

    expect(screen.getByRole('textbox', { name: 'Username' })).toHaveAttribute('type', 'text');
  });

  it('keeps explicit aria-invalid value even when invalid prop is false', () => {
    render(<Input aria-label='Custom validation' aria-invalid='grammar' />);

    expect(screen.getByRole('textbox', { name: 'Custom validation' })).toHaveAttribute('aria-invalid', 'grammar');
  });

  it('invalid wins over explicit aria-invalid="false" and sets data-invalid', () => {
    render(<Input aria-label='Email' invalid aria-invalid='false' />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('data-invalid');
  });

  it('updates value in controlled mode', async () => {
    const user = userEvent.setup();

    render(<ControlledInputHarness />);

    const input = screen.getByRole('textbox', { name: 'Controlled input' });
    await user.clear(input);
    await user.type(input, 'new value');

    expect(screen.getByText('Current value: new value')).toBeInTheDocument();
  });

  it('exposes readOnly and disabled attributes for edge states', () => {
    render(
      <>
        <Input aria-label='Read only field' readOnly defaultValue='Readonly value' />
        <Input aria-label='Disabled field' disabled defaultValue='Disabled value' />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Read only field' })).toHaveAttribute('readonly');
    expect(screen.getByRole('textbox', { name: 'Disabled field' })).toBeDisabled();
  });
});
