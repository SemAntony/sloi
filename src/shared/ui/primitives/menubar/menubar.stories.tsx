import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Menubar,
  MenubarArrow,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from './menubar';
import styles from './menubar.stories.module.scss';

const RADIO_ITEMS = ['Andy', 'Benoit', 'Luis'];
const CHECK_ITEMS = ['Always Show Bookmarks Bar', 'Always Show Full URLs'];

const meta = {
  title: 'UI/Primitives/Menubar',
  component: Menubar
} satisfies Meta<typeof Menubar>;

export default meta;

type Story = StoryObj<typeof meta>;

const MenubarDemo = () => {
  const [checkedSelection, setCheckedSelection] = useState([CHECK_ITEMS[1]]);
  const [radioSelection, setRadioSelection] = useState(RADIO_ITEMS[2]);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent align="start" sideOffset={6} alignOffset={-3}>
            <MenubarItem>
              New Tab
              <MenubarShortcut>Cmd+T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Window
              <MenubarShortcut>Cmd+N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>New Incognito Window</MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>
                Share
              </MenubarSubTrigger>
              <MenubarPortal>
                <MenubarSubContent alignOffset={-5}>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem>Messages</MenubarItem>
                  <MenubarItem>Notes</MenubarItem>
                </MenubarSubContent>
              </MenubarPortal>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              Print...
              <MenubarShortcut>Cmd+P</MenubarShortcut>
            </MenubarItem>
            <MenubarArrow />
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent align="start" sideOffset={6} alignOffset={-3}>
            <MenubarItem>
              Undo
              <MenubarShortcut>Cmd+Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo
              <MenubarShortcut>Shift+Cmd+Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarPortal>
                <MenubarSubContent alignOffset={-5}>
                  <MenubarItem>Search the web...</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Find...</MenubarItem>
                  <MenubarItem>Find Next</MenubarItem>
                  <MenubarItem>Find Previous</MenubarItem>
                </MenubarSubContent>
              </MenubarPortal>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent align="start" sideOffset={6} alignOffset={-14}>
            {CHECK_ITEMS.map((item) => (
              <MenubarCheckboxItem
                key={item}
                checked={checkedSelection.includes(item)}
                onCheckedChange={() => {
                  setCheckedSelection((current) => (
                    current.includes(item)
                      ? current.filter((entry) => entry !== item)
                      : current.concat(item)
                  ));
                }}
              >
                {item}
              </MenubarCheckboxItem>
            ))}
            <MenubarSeparator />
            <MenubarItem inset>
              Reload
              <MenubarShortcut>Cmd+R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem inset disabled>
              Force Reload
              <MenubarShortcut>Shift+Cmd+R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent align="start" sideOffset={6} alignOffset={-14}>
            <MenubarLabel inset>Active profile</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value={radioSelection} onValueChange={setRadioSelection}>
              {RADIO_ITEMS.map((item) => (
                <MenubarRadioItem key={item} value={item}>
                  {item}
                </MenubarRadioItem>
              ))}
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
};

export const Default: Story = {
  render: () => <MenubarDemo />
};

const ControlledPreview = () => {
  const [value, setValue] = useState('');

  return (
    <div className={styles.stack}>
      <Menubar value={value} onValueChange={setValue}>
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarPortal>
            <MenubarContent>
              <MenubarItem>New file</MenubarItem>
              <MenubarItem>Open...</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Close</MenubarItem>
            </MenubarContent>
          </MenubarPortal>
        </MenubarMenu>
        <MenubarMenu value="help">
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarPortal>
            <MenubarContent>
              <MenubarItem>Keyboard shortcuts</MenubarItem>
              <MenubarItem>Documentation</MenubarItem>
            </MenubarContent>
          </MenubarPortal>
        </MenubarMenu>
      </Menubar>

      <p className={styles.status}>Open menu: {value || 'none'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

const CustomContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className={styles.containerPanel}>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Panel Menu</MenubarTrigger>
          <MenubarPortal container={container}>
            <MenubarContent>
              <MenubarItem>Inspect panel</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Pin panel</MenubarItem>
            </MenubarContent>
          </MenubarPortal>
        </MenubarMenu>
      </Menubar>
      <p className={styles.helper}>Menu content is portaled to this local container.</p>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: () => <CustomContainerPreview />
};
