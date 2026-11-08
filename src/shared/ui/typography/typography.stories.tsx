import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './typography';
import styles from './typography.stories.module.scss';

const meta = {
  title: 'Foundations/Typography',
  component: Typography
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <section className={styles.stack}>
      <div className={styles.row}>
        <Typography variant='display-lg'>Display Large</Typography>
        <Typography variant='display-md'>Display Medium</Typography>
        <Typography variant='heading-lg'>Heading Large</Typography>
        <Typography variant='heading-md'>Heading Medium</Typography>
        <Typography variant='heading-sm'>Heading Small</Typography>
        <Typography variant='body-lg'>Body Large for intro sections and highlighted paragraphs.</Typography>
        <Typography variant='body-md'>Body Medium for default content blocks.</Typography>
        <Typography variant='body-sm'>Body Small for compact helper text.</Typography>
        <Typography variant='caption'>Caption for metadata and dense labels.</Typography>
      </div>

      <div className={styles.row}>
        <Typography as='h2' variant='heading-sm'>
          Usage Rules
        </Typography>
        <ul className={styles.rules}>
          <li>Library does not ship a branded font. Typography inherits from product font family.</li>
          <li>Use variant for semantic scale, then override with weight/leading only when necessary.</li>
          <li>Prefer `body-md` as default paragraph style to keep rhythm consistent.</li>
          <li>Use `caption` and `muted` tone only for secondary supporting content.</li>
        </ul>
      </div>
    </section>
  )
};
