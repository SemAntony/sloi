import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from 'storybook/test';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from './dropdown-menu';
import styles from './dropdown-menu.stories.module.scss';

const meta = {
  title: 'UI/Primitives/DropdownMenu',
  component: DropdownMenu
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

const DropdownMenuDemo = () => {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('pedro');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={styles.iconButton} aria-label="Customize options" type="button">
          ☰
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem>
            New tab
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            New window
            <DropdownMenuShortcut>⌘+N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            New private window
            <DropdownMenuShortcut>⇧+⌘+N</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More tools</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  Save page as…
                  <DropdownMenuShortcut>⌘+S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>Create shortcut…</DropdownMenuItem>
                <DropdownMenuItem>Name window…</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Developer tools</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuCheckboxItem checked={bookmarksChecked} onCheckedChange={setBookmarksChecked}>
            Show bookmarks
            <DropdownMenuShortcut>⌘+B</DropdownMenuShortcut>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={urlsChecked} onCheckedChange={setUrlsChecked}>
            Show full URLs
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel inset>People</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={person} onValueChange={setPerson}>
            <DropdownMenuRadioItem value="pedro">Pedro Duarte</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="colm">Colm Tuite</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export const Default: Story = {
  render: () => <DropdownMenuDemo />
};

const ControlledPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.stack}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className={styles.iconButton} aria-label="Open controlled dropdown menu" type="button">
            ☰
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      <p className={styles.status}>State: {open ? 'open' : 'closed'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />,
  play: async ({ canvas, step }) => {
    await step('Open controlled dropdown menu', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Open controlled dropdown menu' }));
      await expect(await screen.findByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
      await expect(canvas.getByText('State: open')).toBeInTheDocument();
    });

    await step('Execute menu item and verify menu closes', async () => {
      await userEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));
      await expect(canvas.getByText('State: closed')).toBeInTheDocument();
    });
  }
};

export const NonModal: Story = {
  render: () => (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className={styles.iconButton} aria-label="Open non-modal menu" type="button">
          ☰
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem>Inspect</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
};

const CustomContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className={styles.containerPanel}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={styles.iconButton} aria-label="Open scoped dropdown menu" type="button">
            ☰
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal container={container}>
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: () => <CustomContainerPreview />
};
