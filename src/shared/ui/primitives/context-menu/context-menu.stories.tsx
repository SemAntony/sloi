import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuArrow,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from './context-menu';
import styles from './context-menu.stories.module.scss';

const meta = {
  title: 'UI/Primitives/ContextMenu',
  component: ContextMenu
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

const ContextMenuDemo = () => {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('pedro');

  return (
    <ContextMenu>
      <ContextMenuTrigger className={styles.triggerArea}>
        <span className={styles.hint}>Right click here</span>
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent>
          <ContextMenuItem>
            Back
            <ContextMenuShortcut>⌘+[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Forward
            <ContextMenuShortcut>⌘+]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘+R</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSub>
            <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuSubContent alignOffset={-6}>
                <ContextMenuItem>
                  Save page as…
                  <ContextMenuShortcut>⌘+S</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>Create shortcut…</ContextMenuItem>
                <ContextMenuItem>Name window…</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Developer tools</ContextMenuItem>
                <ContextMenuArrow />
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>

          <ContextMenuSeparator />

          <ContextMenuCheckboxItem checked={bookmarksChecked} onCheckedChange={setBookmarksChecked}>
            Show bookmarks
            <ContextMenuShortcut>⌘+B</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={urlsChecked} onCheckedChange={setUrlsChecked}>
            Show full URLs
          </ContextMenuCheckboxItem>

          <ContextMenuSeparator />

          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  );
};

export const Default: Story = {
  render: () => <ContextMenuDemo />
};

export const NonModal: Story = {
  render: () => (
    <ContextMenu modal={false}>
      <ContextMenuTrigger className={styles.triggerArea}>
        <span className={styles.hint}>Right click (non-modal)</span>
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent>
          <ContextMenuItem>Inspect</ContextMenuItem>
          <ContextMenuItem>Duplicate</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  )
};

const CustomContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className={styles.containerPanel}>
      <ContextMenu>
        <ContextMenuTrigger className={styles.triggerArea}>
          <span className={styles.hint}>Right click inside panel</span>
        </ContextMenuTrigger>
        <ContextMenuPortal container={container}>
          <ContextMenuContent>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Archive</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenuPortal>
      </ContextMenu>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: () => <CustomContainerPreview />
};
