import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Combobox } from './combobox';

describe('Combobox a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Combobox
        options={[
          { value: 'am', label: 'Armenia' },
          { value: 'de', label: 'Germany' }
        ]}
      />
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  // Попап рендерится в портале, поэтому проверяем весь document.body, а не container.
  const openStateAxe = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } };

  it('has no violations with the list open (D12)', async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        aria-label='Country'
        options={[
          { value: 'am', label: 'Armenia' },
          { value: 'de', label: 'Germany' }
        ]}
      />
    );

    await user.click(screen.getByRole('combobox', { name: 'Country' }));

    expect(screen.getByRole('listbox')).toBeTruthy();
    expect((await axe(document.body, openStateAxe)).violations).toHaveLength(0);
  });

  it('has no violations when nothing matches (D12)', async () => {
    const user = userEvent.setup();
    render(<Combobox aria-label='Country' options={[{ value: 'am', label: 'Armenia' }]} />);

    await user.type(screen.getByRole('combobox', { name: 'Country' }), 'zzz');

    expect(screen.getByText('No options found.')).toBeTruthy();
    expect((await axe(document.body, openStateAxe)).violations).toHaveLength(0);
  });
});
