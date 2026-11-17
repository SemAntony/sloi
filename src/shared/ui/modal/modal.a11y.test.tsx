import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Modal } from './modal';

// Контент рендерится в портале, поэтому проверяем весь document.body.
const options = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } };

describe('Modal a11y (D17)', () => {
  it('has no violations with a title', async () => {
    render(
      <Modal open title='Delete item'>
        <p>Deletion cannot be undone.</p>
        <button type='button'>Confirm</button>
      </Modal>
    );

    expect((await axe(document.body, options)).violations).toHaveLength(0);
  });

  it('has no violations without a title and without the close button', async () => {
    render(
      <Modal open closeButton={false}>
        <button type='button'>Confirm</button>
      </Modal>
    );

    expect((await axe(document.body, options)).violations).toHaveLength(0);
  });
});
