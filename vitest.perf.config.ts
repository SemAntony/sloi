import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Perf-бюджеты (FPS, TTFSR, long tasks) зависят от нагрузки машины,
// поэтому запускаются отдельно и без параллелизма между файлами.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.perf.test.{ts,tsx}'],
    exclude: ['src/test/fixtures/**'],
    css: true,
    globals: false,
    fileParallelism: false
  }
});
