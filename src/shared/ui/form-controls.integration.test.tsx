import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './input/input';
import { Checkbox } from './primitives/checkbox/checkbox';
import { RadioGroup, RadioGroupItem } from './primitives/radio-group/radio-group';
import { Switch, SwitchThumb } from './primitives/switch/switch';

const FormControlsHarness = ({
  defaultName = 'Alice',
  defaultAcceptTerms = true,
  defaultPlan = 'pro',
  defaultNotifications = true
}: {
  defaultName?: string;
  defaultAcceptTerms?: boolean;
  defaultPlan?: string;
  defaultNotifications?: boolean;
}) => {
  return (
    <form aria-label='Settings form'>
      <label htmlFor='full-name'>Full name</label>
      <Input id='full-name' name='fullName' defaultValue={defaultName} />

      <label>
        <Checkbox
          aria-label='Accept terms'
          name='terms'
          value='accepted'
          defaultChecked={defaultAcceptTerms}
        />
        Accept terms
      </label>

      <fieldset>
        <legend>Plan</legend>
        <RadioGroup name='plan' defaultValue={defaultPlan} aria-label='Plan'>
          <RadioGroupItem value='free' aria-label='Free plan' />
          <RadioGroupItem value='pro' aria-label='Pro plan' />
        </RadioGroup>
      </fieldset>

      <label>
        <Switch
          aria-label='Enable notifications'
          name='notifications'
          value='enabled'
          defaultChecked={defaultNotifications}
        >
          <SwitchThumb />
        </Switch>
        Enable notifications
      </label>

      <button type='submit'>Submit</button>
    </form>
  );
};

describe('Form controls integration', () => {
  it('submits default values from input, checkbox, radio group and switch', async () => {
    const user = userEvent.setup();
    let submitted: Record<string, FormDataEntryValue> = {};

    render(
      <FormControlsHarness />
    );

    const form = screen.getByRole('form', { name: 'Settings form' });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitted = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement).entries());
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(submitted).toEqual({
      fullName: 'Alice',
      terms: 'accepted',
      plan: 'pro',
      notifications: 'enabled'
    });
  });

  it('submits updated values after user interactions', async () => {
    const user = userEvent.setup();
    let submitted: Record<string, FormDataEntryValue> = {};

    render(
      <FormControlsHarness
        defaultName='Alex'
        defaultAcceptTerms={false}
        defaultPlan='free'
        defaultNotifications={false}
      />
    );

    const form = screen.getByRole('form', { name: 'Settings form' });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitted = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement).entries());
    });

    const fullName = screen.getByRole('textbox', { name: 'Full name' });
    await user.clear(fullName);
    await user.type(fullName, 'Taylor');

    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));
    await user.click(screen.getByRole('radio', { name: 'Pro plan' }));
    await user.click(screen.getByRole('switch', { name: 'Enable notifications' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(submitted).toEqual({
      fullName: 'Taylor',
      terms: 'accepted',
      plan: 'pro',
      notifications: 'enabled'
    });
  });
});
