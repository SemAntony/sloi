import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // perf-тесты меряют время по часам и флакают при параллельной нагрузке: см. test:perf
    exclude: ['src/test/fixtures/**', 'src/**/*.perf.test.{ts,tsx}'],
    css: true,
    globals: false
  }
});
