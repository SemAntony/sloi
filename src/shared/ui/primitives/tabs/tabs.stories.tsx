import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import styles from './tabs.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Tabs',
  component: Tabs
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className={styles.container}>
      <TabsList aria-label="Manage your account">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className={styles.panel}>
        <p className={styles.text}>Make changes to your account here. Click save when you are done.</p>
      </TabsContent>
      <TabsContent value="password" className={styles.panel}>
        <p className={styles.text}>Change your password here. After saving, you will be logged out.</p>
      </TabsContent>
    </Tabs>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState('overview');

  return (
    <div className={styles.stack}>
      <Tabs value={value} onValueChange={setValue} className={styles.container}>
        <TabsList aria-label="Documentation sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="a11y">A11y</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className={styles.panel}>Overview tab content.</TabsContent>
        <TabsContent value="api" className={styles.panel}>API tab content.</TabsContent>
        <TabsContent value="a11y" className={styles.panel}>Accessibility tab content.</TabsContent>
      </Tabs>
      <span className={styles.status}>Current tab: {value}</span>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />,
  play: async ({ canvas, step }) => {
    await step('Switch controlled tab', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'API' }));
      await expect(canvas.getByText('Current tab: api')).toBeInTheDocument();
      // Панель появляется с fade-in (opacity 0 → 1, 140ms): ждём конца анимации, а не проверяем мгновенно.
      await waitFor(() => expect(canvas.getByText('API tab content.')).toBeVisible());
    });
  }
};

export const VerticalManual: Story = {
  render: () => (
    <Tabs
      defaultValue="details"
      orientation="vertical"
      activationMode="manual"
      className={styles.containerWide}
    >
      <TabsList aria-label="Project settings">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className={styles.panel}>
        <p className={styles.text}>Project metadata and workspace defaults.</p>
      </TabsContent>
      <TabsContent value="members" className={styles.panel}>
        <p className={styles.text}>Manage team roles and invitations.</p>
      </TabsContent>
      <TabsContent value="billing" className={styles.panel}>
        <p className={styles.text}>Invoices, plan limits, and payment method.</p>
      </TabsContent>
    </Tabs>
  )
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="public" className={styles.container}>
      <TabsList aria-label="Visibility">
        <TabsTrigger value="public">Public</TabsTrigger>
        <TabsTrigger value="internal">Internal</TabsTrigger>
        <TabsTrigger value="private" disabled>
          Private
        </TabsTrigger>
      </TabsList>
      <TabsContent value="public" className={styles.panel}>
        <p className={styles.text}>Visible to everyone.</p>
      </TabsContent>
      <TabsContent value="internal" className={styles.panel}>
        <p className={styles.text}>Visible inside your organization.</p>
      </TabsContent>
      <TabsContent value="private" className={styles.panel}>
        <p className={styles.text}>Visible only to selected members.</p>
      </TabsContent>
    </Tabs>
  )
};
