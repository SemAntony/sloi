import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../shared/ui/input/input';
import { NumberField } from '../shared/ui/number-field';
import { PhoneField } from '../shared/ui/phone-field';
import { SearchInput } from '../shared/ui/search-input';
import { Textarea } from '../shared/ui/textarea';

// P1 (D38): поле с width: 100% и border/padding не должно зависеть от reset приложения.
// jsdom не считает раскладку, поэтому проверяем применённый CSS: box-sizing у корня поля.
const boxSizing = (element: Element) => getComputedStyle(element).boxSizing;

describe('field controls: box-sizing: border-box without app reset (D38)', () => {
  it('Input, Textarea и PhoneField сами задают border-box', () => {
    const { container } = render(
      <>
        <Input aria-label='input' />
        <Textarea aria-label='textarea' />
        <PhoneField aria-label='phone' />
      </>
    );

    const fields = container.querySelectorAll('input, textarea');
    expect(fields).toHaveLength(3);
    for (const field of fields) {
      expect(boxSizing(field), field.getAttribute('aria-label') ?? '').toBe('border-box');
    }
  });

  it('SearchInput и NumberField: border-box у корня и у внутреннего input', () => {
    const { container } = render(
      <>
        <SearchInput aria-label='search' />
        <NumberField aria-label='number' />
      </>
    );

    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(2);
    for (const input of inputs) {
      expect(boxSizing(input), 'inner input').toBe('border-box');
      expect(boxSizing(input.parentElement as Element), 'root').toBe('border-box');
    }
  });
});
