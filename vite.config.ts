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
      // Корень + heavy-подпути (критерии в docs/architecture/EXPORT-SUBPATHS.md).
      // Новый подпуть: вход здесь, запись в package.json `exports`, имя в scripts/post-build.mjs.
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'date-picker': resolve(__dirname, 'src/date-picker.ts'),
        'data-table-v2': resolve(__dirname, 'src/data-table-v2.ts')
      },
      name: 'SloiUI',
      formats: ['es', 'cjs'],
      cssFileName: 'style',
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      // external = пакеты, которые потребитель получает через dependencies/peerDependencies.
      // react-day-picker (и его date-fns/@date-fns/tz) внешний, но только корневой импорт:
      // 'react-day-picker/style.css' намеренно НЕ external, чтобы его CSS попадал
      // в единый dist/style.css, а не оставался import-ом в чанке.
      // Всё остальное (clsx, @sloi/*) вшивается в бандл.
      external: (id) =>
        /^react(?:\/.*)?$/.test(id) ||
        id === 'radix-ui' ||
        id === 'lucide-react' ||
        id === 'react-day-picker',
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
