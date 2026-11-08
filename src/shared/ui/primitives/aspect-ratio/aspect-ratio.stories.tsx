import type { Meta, StoryObj } from '@storybook/react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import { AspectRatio } from './aspect-ratio';
import styles from './aspect-ratio.stories.module.scss';

const meta = {
  title: 'UI/Primitives/AspectRatio',
  component: AspectRatio,
  args: {
    ratio: 16 / 9
  },
  argTypes: {
    ratio: {
      control: { type: 'number', min: 0.1, step: 0.1 }
    }
  }
} satisfies Meta<typeof AspectRatio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ratio }) => (
    <div className={styles.demoContainer}>
      <AspectRatio ratio={ratio}>
        <div className={styles.slot}>16:9 media slot</div>
      </AspectRatio>
    </div>
  )
};

export const Portrait: Story = {
  render: () => (
    <div className={styles.demoContainerNarrow}>
      <AspectRatio ratio={3 / 4}>
        <div className={styles.slot}>3:4 portrait slot</div>
      </AspectRatio>
    </div>
  )
};

const AspectRatioFrame = forwardRef<HTMLElement, ComponentPropsWithoutRef<'section'>>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      {...props}
      className={cn(styles.customFrame, className)}
    />
  )
);

AspectRatioFrame.displayName = 'AspectRatioFrame';

export const Image: Story = {
  render: () => (
    <div className={styles.demoContainer}>
      <AspectRatio ratio={16 / 9}>
        <img
          className={styles.image}
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&q=80&auto=format&fit=crop"
          alt="Landscape photograph by Tobias Tullius"
          loading="lazy"
        />
      </AspectRatio>
    </div>
  )
};

export const AsChild: Story = {
  render: () => (
    <div className={styles.demoContainer}>
      <AspectRatio ratio={1} asChild>
        <AspectRatioFrame>asChild + custom leaf component</AspectRatioFrame>
      </AspectRatio>
    </div>
  )
};
