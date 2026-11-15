import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from '../input';
import { NumberField } from '../number-field';
import { PhoneField } from '../phone-field';
import { Select, SelectTrigger, SelectValue } from '../primitives/select';
import { SearchInput } from '../search-input';
import { Textarea } from '../textarea';
import { Field } from './field';

describe('Field', () => {
  it('связывает label с полем: клик по подписи ставит фокус, имя поля берётся из label', async () => {
    const user = userEvent.setup();
    render(
      <Field label='Email'>
        <Input />
      </Field>
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    await user.click(screen.getByText('Email'));
    expect(input).toHaveFocus();
  });

  it('hint попадает в aria-describedby', () => {
    render(
      <Field label='Email' hint='We never share it'>
        <Input />
      </Field>
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('We never share it');
  });

  it('error включает aria-invalid и объявляется, hint и error описывают поле вместе', () => {
    render(
      <Field label='Email' hint='We never share it' error='Enter a valid email'>
        <Input />
      </Field>
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('data-invalid');
    expect(input).toHaveAccessibleDescription('We never share it Enter a valid email');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
  });

  it('invalid без текста ошибки тоже ставит aria-invalid', () => {
    render(
      <Field label='Email' invalid>
        <Input />
      </Field>
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('required: звёздочка скрыта от скринридера, поле получает aria-required', () => {
    render(
      <Field label='Email' required>
        <Input />
      </Field>
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('disabled отключает поле', () => {
    render(
      <Field label='Email' disabled>
        <Input />
      </Field>
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  });

  it('свой aria-describedby у поля склеивается с hint, а не теряется', () => {
    render(
      <>
        <p id='extra'>Extra note</p>
        <Field label='Email' hint='Hint'>
          <Input aria-describedby='extra' />
        </Field>
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Extra note Hint');
  });

  it('id задаётся через Field и совпадает с htmlFor; id на самом поле не ломает связь с label', () => {
    render(
      <>
        <Field label='Email' id='email'>
          <Input />
        </Field>
        <Field label='Name'>
          <Input id='ignored-id' />
        </Field>
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('id', 'email');
    const name = screen.getByRole('textbox', { name: 'Name' });
    expect(name).not.toHaveAttribute('id', 'ignored-id');
  });

  it('без Field поля не получают лишних атрибутов', () => {
    render(<Input aria-label='Standalone' />);

    const input = screen.getByRole('textbox', { name: 'Standalone' });
    expect(input).not.toHaveAttribute('id');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-required');
  });

  it('два Field на странице получают разные id', () => {
    render(
      <>
        <Field label='First' hint='One'>
          <Input />
        </Field>
        <Field label='Second' hint='Two'>
          <Input />
        </Field>
      </>
    );

    const first = screen.getByRole('textbox', { name: 'First' });
    const second = screen.getByRole('textbox', { name: 'Second' });
    expect(first.id).not.toBe(second.id);
    expect(first).toHaveAccessibleDescription('One');
    expect(second).toHaveAccessibleDescription('Two');
  });

  it('работает с Textarea, PhoneField, NumberField и SearchInput', () => {
    render(
      <>
        <Field label='Bio' hint='Bio hint'>
          <Textarea />
        </Field>
        <Field label='Phone' error='Bad phone'>
          <PhoneField />
        </Field>
        <Field label='Quantity' required>
          <NumberField />
        </Field>
        <Field label='Find' disabled>
          <SearchInput />
        </Field>
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAccessibleDescription('Bio hint');
    expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveAttribute('aria-required', 'true');
    expect(screen.getByRole('searchbox', { name: 'Find' })).toBeDisabled();
  });

  it('NumberField и SearchInput: invalid из Field попадает на корень (стили) и не ломает кнопки', () => {
    const { container } = render(
      <Field label='Quantity' error='Too many'>
        <NumberField />
      </Field>
    );

    expect(container.querySelector('input')?.parentElement).toHaveAttribute('data-invalid');
  });

  it('работает с SelectTrigger: подпись, описание, invalid', () => {
    render(
      <Field label='Role' hint='Pick one' error='Required'>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Choose' />
          </SelectTrigger>
        </Select>
      </Field>
    );

    const trigger = screen.getByRole('combobox', { name: /Role/ });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('Pick one Required');
  });
});

describe('SelectTrigger fullWidth', () => {
  it('добавляет класс растягивания только по флагу', () => {
    render(
      <>
        <Select>
          <SelectTrigger aria-label='Wide' fullWidth>
            <SelectValue />
          </SelectTrigger>
        </Select>
        <Select>
          <SelectTrigger aria-label='Narrow'>
            <SelectValue />
          </SelectTrigger>
        </Select>
      </>
    );

    const wide = screen.getByRole('combobox', { name: 'Wide' });
    const narrow = screen.getByRole('combobox', { name: 'Narrow' });
    expect(wide.className).toMatch(/fullWidth/);
    expect(narrow.className).not.toMatch(/fullWidth/);
  });
});
