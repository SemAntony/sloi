import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isStorybook = process.argv.some((arg) => arg.includes('storybook'));

// Rollup удаляет module-level директивы, поэтому возвращаем 'use client'
// в entry-чанки (ESM и CJS), чтобы библиотека работала в Next.js App Router.
const preserveUseClient = (): Plugin => ({
  name: 'sloi:preserve-use-client',
  apply: 'build',
  renderChunk(code, chunk) {
    if (!chunk.isEntry) return null;
    return { code: `'use client';\n${code}`, map: null };
  }
});

export default defineConfig({
  plugins: [
    react(),
    !isStorybook && preserveUseClient(),
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
