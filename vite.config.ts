import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isStorybook = process.argv.some((arg) => arg.includes('storybook'));

export default defineConfig({
  plugins: [
    react(),
    !isStorybook &&
      dts({
        include: ['src'],
        entryRoot: 'src',
        exclude: [
          'src/dev/**',
          'src/test/**',
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.stories.ts',
          '**/*.stories.tsx'
        ]
      })
  ].filter(Boolean),
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SloiUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    rollupOptions: {
      external: (id) => /^react(?:\/.*)?$/.test(id) || id === 'radix-ui',
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'radix-ui': 'RadixUI'
        }
      }
    }
  }
});
