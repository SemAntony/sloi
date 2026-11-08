import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';
import { useState } from 'react';
import {
  Select,
  SelectArrow,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectPortal,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from './select';
import styles from './select.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Select',
  component: Select
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const FoodContent = () => (
  <>
    <SelectScrollUpButton />
    <SelectViewport>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Vegetables</SelectLabel>
        <SelectItem value="aubergine">Aubergine</SelectItem>
        <SelectItem value="broccoli">Broccoli</SelectItem>
        <SelectItem value="carrot" disabled>
          Carrot
        </SelectItem>
        <SelectItem value="courgette">Courgette</SelectItem>
        <SelectItem value="leek">Leek</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Meat</SelectLabel>
        <SelectItem value="beef">Beef</SelectItem>
        <SelectItem value="chicken">Chicken</SelectItem>
        <SelectItem value="lamb">Lamb</SelectItem>
        <SelectItem value="pork">Pork</SelectItem>
      </SelectGroup>
    </SelectViewport>
    <SelectScrollDownButton />
  </>
);

export const Default: Story = {
  render: () => (
    <Select defaultValue="blueberry">
      <SelectTrigger className={styles.trigger} aria-label="Food">
        <SelectValue placeholder="Select a food..." />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent className={styles.content}>
          <FoodContent />
        </SelectContent>
      </SelectPortal>
    </Select>
  )
};

const ControlledPreview = () => {
  const [value, setValue] = useState('react');

  return (
    <div className={styles.stack}>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className={styles.triggerWide} aria-label="Framework">
          <SelectValue placeholder="Choose framework..." />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent className={styles.content}>
            <SelectViewport>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
              <SelectItem value="solid">Solid</SelectItem>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </Select>
      <p className={styles.status}>Current value: {value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />,
  play: async ({ canvas, step }) => {
    await step('Open controlled select', async () => {
      await userEvent.click(canvas.getByRole('combobox', { name: 'Framework' }));
      await expect(await screen.findByRole('option', { name: 'Vue' })).toBeInTheDocument();
    });

    await step('Select another value and verify controlled state', async () => {
      await userEvent.click(screen.getByRole('option', { name: 'Vue' }));
      await expect(canvas.getByText('Current value: vue')).toBeInTheDocument();
    });
  }
};

export const PopperWithArrow: Story = {
  render: () => (
    <Select defaultValue="france">
      <SelectTrigger className={styles.triggerWide} aria-label="Country">
        <SelectValue placeholder="Select a country..." />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent className={styles.contentMatchTrigger} position="popper" sideOffset={8}>
          <SelectViewport>
            <SelectItem value="france">France</SelectItem>
            <SelectItem value="spain">Spain</SelectItem>
            <SelectItem value="italy">Italy</SelectItem>
            <SelectItem value="portugal">Portugal</SelectItem>
            <SelectItem value="germany">Germany</SelectItem>
          </SelectViewport>
          <SelectArrow width={12} height={6} />
        </SelectContent>
      </SelectPortal>
    </Select>
  )
};

const ContainerPreview = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainer} className={styles.containerPanel}>
      <Select defaultValue="react">
        <SelectTrigger className={styles.triggerWide} aria-label="Framework">
          <SelectValue placeholder="Choose framework..." />
        </SelectTrigger>
        <SelectPortal container={container}>
          <SelectContent className={styles.content}>
            <SelectViewport>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="remix">Remix</SelectItem>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </Select>
    </div>
  );
};

export const WithCustomContainer: Story = {
  render: () => <ContainerPreview />
};

export const RightToLeft: Story = {
  render: () => (
    <Select defaultValue="banana" dir="rtl">
      <SelectTrigger className={styles.triggerWide} aria-label="Food">
        <SelectValue placeholder="Select a food..." />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent className={styles.content}>
          <FoodContent />
        </SelectContent>
      </SelectPortal>
    </Select>
  )
};
