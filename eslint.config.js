import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'storybook-static'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lucide-react',
              message:
                'Use curated Icon* exports from src/shared/ui/icon/icons.ts (or @sloi/ui-kit) instead of direct lucide-react imports.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/shared/ui/icon/icon.tsx', 'src/shared/ui/icon/icons.ts'],
    rules: {
      'no-restricted-imports': 'off'
    }
  }
);
