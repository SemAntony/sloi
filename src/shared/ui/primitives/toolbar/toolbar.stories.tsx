import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem
} from './toolbar';
import styles from './toolbar.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Toolbar',
  component: Toolbar
} satisfies Meta<typeof Toolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toolbar aria-label="Formatting options">
      <ToolbarToggleGroup type="multiple" aria-label="Text formatting">
        <ToolbarToggleItem value="bold" aria-label="Bold">
          B
        </ToolbarToggleItem>
        <ToolbarToggleItem value="italic" aria-label="Italic">
          I
        </ToolbarToggleItem>
        <ToolbarToggleItem value="strikethrough" aria-label="Strike through">
          S
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarToggleGroup type="single" defaultValue="center" aria-label="Text alignment">
        <ToolbarToggleItem value="left" aria-label="Left aligned">
          L
        </ToolbarToggleItem>
        <ToolbarToggleItem value="center" aria-label="Center aligned">
          C
        </ToolbarToggleItem>
        <ToolbarToggleItem value="right" aria-label="Right aligned">
          R
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarLink className={styles.metaLink} href="https://radix-ui.com" target="_blank" rel="noreferrer">
        Edited 2 hours ago
      </ToolbarLink>
      <ToolbarButton className={styles.pushRight}>Share</ToolbarButton>
    </Toolbar>
  )
};

const ControlledPreview = () => {
  const [alignment, setAlignment] = useState('center');
  const [stylesValue, setStylesValue] = useState<string[]>(['bold']);

  return (
    <div className={styles.stack}>
      <Toolbar aria-label="Editor tools">
        <ToolbarButton aria-label="Undo">Undo</ToolbarButton>
        <ToolbarButton aria-label="Redo">Redo</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarToggleGroup type="multiple" value={stylesValue} onValueChange={setStylesValue} aria-label="Text styles">
          <ToolbarToggleItem value="bold" aria-label="Bold">
            Bold
          </ToolbarToggleItem>
          <ToolbarToggleItem value="italic" aria-label="Italic">
            Italic
          </ToolbarToggleItem>
          <ToolbarToggleItem value="underline" aria-label="Underline">
            Underline
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarToggleGroup
          type="single"
          value={alignment}
          onValueChange={(next) => {
            if (next) {
              setAlignment(next);
            }
          }}
          aria-label="Text alignment"
        >
          <ToolbarToggleItem value="left">Left</ToolbarToggleItem>
          <ToolbarToggleItem value="center">Center</ToolbarToggleItem>
          <ToolbarToggleItem value="right">Right</ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
      <p className={styles.meta}>Styles: {stylesValue.join(', ') || 'None'} | Alignment: {alignment}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

export const Vertical: Story = {
  render: () => (
    <Toolbar orientation="vertical" aria-label="Vertical editor tools" className={styles.verticalToolbar}>
      <ToolbarButton>Undo</ToolbarButton>
      <ToolbarButton>Redo</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup type="multiple" orientation="vertical" aria-label="Text styles">
        <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
        <ToolbarToggleItem value="italic">Italic</ToolbarToggleItem>
        <ToolbarToggleItem value="underline">Underline</ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
  )
};

export const Disabled: Story = {
  render: () => (
    <Toolbar aria-label="Disabled controls">
      <ToolbarButton disabled>Undo</ToolbarButton>
      <ToolbarButton>Redo</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup type="single" defaultValue="center" aria-label="Alignment">
        <ToolbarToggleItem value="left">Left</ToolbarToggleItem>
        <ToolbarToggleItem value="center" disabled>
          Center
        </ToolbarToggleItem>
        <ToolbarToggleItem value="right">Right</ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
  )
};
