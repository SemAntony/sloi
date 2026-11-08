import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Tabs defaultValue='overview'>
        <TabsList aria-label='Profile sections'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>Overview panel</TabsContent>
        <TabsContent value='settings'>Settings panel</TabsContent>
      </Tabs>
    );
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });

  it('has no detectable accessibility violations in manual vertical mode', async () => {
    const { container } = render(
      <Tabs defaultValue='overview' orientation='vertical' activationMode='manual'>
        <TabsList aria-label='Profile sections vertical'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='settings' disabled>
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>Overview panel</TabsContent>
        <TabsContent value='settings'>Settings panel</TabsContent>
      </Tabs>
    );

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
