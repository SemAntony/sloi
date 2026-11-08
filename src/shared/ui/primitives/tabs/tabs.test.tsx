import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs', () => {
  it('switches active tab and panel', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue='overview'>
        <TabsList aria-label='Profile sections'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>Overview panel</TabsContent>
        <TabsContent value='settings'>Settings panel</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Overview panel')).toBeVisible();
    expect(screen.queryByText('Settings panel')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(screen.getByText('Settings panel')).toBeVisible();
    expect(screen.queryByText('Overview panel')).not.toBeInTheDocument();
  });

  it('calls onValueChange in controlled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs value='overview' onValueChange={onValueChange}>
        <TabsList aria-label='Controlled tabs'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>Overview panel</TabsContent>
        <TabsContent value='settings'>Settings panel</TabsContent>
      </Tabs>
    );

    await user.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(onValueChange).toHaveBeenCalledWith('settings');
  });

  it('supports keyboard arrow navigation with automatic activation', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue='overview'>
        <TabsList aria-label='Arrow navigation tabs'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
          <TabsTrigger value='billing'>Billing</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>Overview panel</TabsContent>
        <TabsContent value='settings'>Settings panel</TabsContent>
        <TabsContent value='billing'>Billing panel</TabsContent>
      </Tabs>
    );

    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    overviewTab.focus();
    await user.keyboard('{ArrowRight}');

    const settingsTab = screen.getByRole('tab', { name: 'Settings' });
    expect(settingsTab).toHaveFocus();
    expect(settingsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Settings panel')).toBeVisible();
  });

  it('keeps panel unchanged in manual activation mode until confirm key', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue='overview' activationMode='manual'>
        <TabsList aria-label='Manual tabs'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>Overview panel</TabsContent>
        <TabsContent value='settings'>Settings panel</TabsContent>
      </Tabs>
    );

    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    overviewTab.focus();
    await user.keyboard('{ArrowRight}');

    const settingsTab = screen.getByRole('tab', { name: 'Settings' });
    expect(settingsTab).toHaveFocus();
    expect(settingsTab).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Overview panel')).toBeVisible();
    expect(screen.queryByText('Settings panel')).not.toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(settingsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Settings panel')).toBeVisible();
  });

  it('keeps disabled tab non-interactive', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue='overview'>
        <TabsList aria-label='Disabled tabs'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='settings' disabled>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>Overview panel</TabsContent>
        <TabsContent value='settings'>Settings panel</TabsContent>
      </Tabs>
    );

    const disabledTab = screen.getByRole('tab', { name: 'Settings' });
    expect(disabledTab).toBeDisabled();

    await user.click(disabledTab);
    expect(disabledTab).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Overview panel')).toBeVisible();
    expect(screen.queryByText('Settings panel')).not.toBeInTheDocument();
  });
});
