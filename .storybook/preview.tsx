import type { Preview } from '@storybook/react';
import '../src/app/styles/tokens.css';
import '../src/app/styles/typography.css';

const preview: Preview = {
  tags: ['autodocs', 'stable'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      test: 'error'
    },
    layout: 'centered',
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Foundations', 'Primitives', 'UI', 'Patterns', '*']
      }
    }
  },
  decorators: [
    (Story, { parameters }) => {
      const pageLayout = parameters.pageLayout as 'page' | 'page-mobile' | undefined;

      if (pageLayout === 'page') {
        return (
          <div style={{ width: '100%', maxWidth: 1080, margin: '0 auto', padding: 24 }}>
            <Story />
          </div>
        );
      }

      if (pageLayout === 'page-mobile') {
        return (
          <div style={{ width: 390, margin: '0 auto', padding: 16 }}>
            <Story />
          </div>
        );
      }

      return <Story />;
    }
  ]
};

export default preview;
