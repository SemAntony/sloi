import type { Meta, StoryObj } from '@storybook/react';
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport
} from './scroll-area';
import styles from './scroll-area.stories.module.scss';

const meta = {
  title: 'UI/Primitives/ScrollArea',
  component: ScrollArea
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const TAGS = Array.from({ length: 50 }).map((_, index, array) => `v1.2.0-beta.${array.length - index}`);

const Scrollbars = ({ horizontal = true }: { horizontal?: boolean }) => (
  <>
    <ScrollAreaScrollbar orientation="vertical">
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>
    {horizontal && (
      <>
        <ScrollAreaScrollbar orientation="horizontal">
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        <ScrollAreaCorner />
      </>
    )}
  </>
);

export const Default: Story = {
  render: () => (
    <div className={styles.frameWide}>
      <ScrollArea className={styles.area}>
        <ScrollAreaViewport className={styles.viewport}>
          <div className={styles.canvas}>
            <div className={styles.canvasHeader}>
              <span className={styles.title}>Release Tags</span>
              <span className={styles.hint}>Scroll in both directions</span>
            </div>
            <div className={styles.tagRow}>
              {TAGS.map((tag) => (
                <span key={tag} className={styles.tagChip}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </ScrollAreaViewport>
        <Scrollbars />
      </ScrollArea>
    </div>
  )
};

export const VerticalOnly: Story = {
  render: () => (
    <div className={styles.frameNarrow}>
      <ScrollArea className={styles.area}>
        <ScrollAreaViewport className={styles.viewport}>
          <div className={styles.listContent}>
            <span className={styles.title}>Tags</span>
            {TAGS.map((tag) => (
              <span key={tag} className={styles.listItem}>
                {tag}
              </span>
            ))}
          </div>
        </ScrollAreaViewport>
        <Scrollbars horizontal={false} />
      </ScrollArea>
    </div>
  )
};

export const AlwaysVisible: Story = {
  render: () => (
    <div className={styles.frameWide}>
      <ScrollArea className={styles.area} type="always">
        <ScrollAreaViewport className={styles.viewport}>
          <div className={styles.gridContent}>
            {Array.from({ length: 42 }).map((_, index) => (
              <div key={index} className={styles.gridCell}>
                Item {index + 1}
              </div>
            ))}
          </div>
        </ScrollAreaViewport>
        <Scrollbars />
      </ScrollArea>
    </div>
  )
};

export const RightToLeft: Story = {
  render: () => (
    <div className={styles.frameWide}>
      <ScrollArea className={styles.area} dir="rtl">
        <ScrollAreaViewport className={styles.viewport}>
          <div className={styles.canvas}>
            <div className={styles.canvasHeader}>
              <span className={styles.title}>Right to left direction</span>
              <span className={styles.hint}>RTL scroll direction support</span>
            </div>
            <div className={styles.tagRow}>
              {TAGS.map((tag) => (
                <span key={tag} className={styles.tagChip}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </ScrollAreaViewport>
        <Scrollbars />
      </ScrollArea>
    </div>
  )
};
