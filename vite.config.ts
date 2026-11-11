import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isStorybook = process.argv.some((arg) => arg.includes('storybook'));

// 'use client' в src/index.ts сохраняется в бандле самим Vite 8 (Rolldown);
// с Vite 5/6 (Rollup) директиву приходилось возвращать плагином в renderChunk.

export default defineConfig({
  plugins: [
    react(),
    !isStorybook &&
      dts({
        include: ['src'],
        entryRoot: 'src',
        bundleTypes: true,
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
      cssFileName: 'style',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    rollupOptions: {
      // external = пакеты, которые потребитель получает через dependencies/peerDependencies.
      // Всё остальное (clsx, react-day-picker вместе с его CSS, @sloi/*) вшивается в бандл.
      external: (id) =>
        /^react(?:\/.*)?$/.test(id) || id === 'radix-ui' || id === 'lucide-react',
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
