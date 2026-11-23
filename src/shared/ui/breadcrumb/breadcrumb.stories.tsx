import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {Breadcrumb} from './breadcrumb';
import {Icon, IconArrowRight} from '../icon';
import styles from '../input/input.stories.module.scss';

const items = [
    {label: 'Home', href: '#'},
    {label: 'Projects', href: '#'},
    {label: 'Design System', href: '#'},
    {label: 'Data Table'}
];

const meta = {
    title: 'UI/Breadcrumb',
    component: Breadcrumb,
    args: {
        items
    }
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
    render: () => (
        <div className={styles.stack}>
            <Breadcrumb label='Default path' items={items}/>
            <Breadcrumb
                label='Path with disabled item'
                items={[
                    {label: 'Home', href: '#'},
                    {label: 'Library', href: '#'},
                    {label: 'Draft', disabled: true},
                    {label: 'Current page'}
                ]}
            />
            <Breadcrumb
                label='Path with custom separator'
                items={[
                    {label: 'Dashboard', href: '#'},
                    {label: 'Reports', href: '#'},
                    {label: 'Quarterly'}
                ]}
                // SVG вместо текстового '→': у символа без текстового начертания axe не может посчитать контраст
                // и пишет needs review ("content contains only non-text characters").
                separator={<Icon icon={IconArrowRight} size='sm' decorative />}
            />
        </div>
    )
};

const ControlledPreview = () => {
    const [currentIndex, setCurrentIndex] = useState(2);

    return (
        <div className={styles.stack}>
            <Breadcrumb
                items={[
                    {label: 'Step 1'},
                    {label: 'Step 2'},
                    {label: 'Step 3'},
                    {label: 'Step 4'}
                ]}
                currentIndex={currentIndex}
                onCurrentIndexChange={setCurrentIndex}
            />
            <p className={styles.meta}>Controlled current
                index: {currentIndex}</p>
        </div>
    );
};

export const Controlled: Story = {
    render: () => <ControlledPreview/>
};
