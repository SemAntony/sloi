import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Slider, SliderRange, SliderThumb, SliderTrack } from './slider';
import styles from './slider.stories.module.scss';

const meta = {
  title: 'UI/Primitives/Slider',
  component: Slider
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

const SingleValuePreview = () => {
  const [value, setValue] = useState([50]);

  return (
    <div className={styles.stack}>
      <Slider value={value} onValueChange={setValue} max={100} step={1} className={styles.sliderWide}>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb aria-label="Volume" />
      </Slider>
      <span className={styles.meta}>Value: {value[0]}</span>
    </div>
  );
};

export const Default: Story = {
  render: () => <SingleValuePreview />
};

const RangePreview = () => {
  const [value, setValue] = useState([20, 80]);

  return (
    <div className={styles.stack}>
      <Slider
        value={value}
        onValueChange={setValue}
        max={100}
        minStepsBetweenThumbs={5}
        className={styles.sliderWide}
      >
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb aria-label="Minimum price" />
        <SliderThumb aria-label="Maximum price" />
      </Slider>
      <span className={styles.meta}>
        Range: {value[0]} - {value[1]}
      </span>
    </div>
  );
};

export const Range: Story = {
  render: () => <RangePreview />
};

const VerticalPreview = () => {
  const [value, setValue] = useState([30]);

  return (
    <div className={styles.verticalWrap}>
      <Slider
        value={value}
        onValueChange={setValue}
        orientation="vertical"
        className={styles.sliderTall}
        aria-label="Brightness"
      >
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb aria-label="Brightness value" />
      </Slider>
      <span className={styles.meta}>Brightness: {value[0]}</span>
    </div>
  );
};

export const Vertical: Story = {
  render: () => <VerticalPreview />
};

export const Disabled: Story = {
  render: () => (
    <div className={styles.stack}>
      <Slider defaultValue={[65]} disabled className={styles.sliderWide} aria-label="Disabled slider">
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb aria-label="Disabled value" />
      </Slider>
      <span className={styles.meta}>Disabled state</span>
    </div>
  )
};
