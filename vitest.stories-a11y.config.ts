import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Аудит a11y по всем stories (jsdom + axe). См. src/test/stories-a11y.audit.tsx
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/stories-a11y.audit.tsx'],
    css: true,
    globals: false
  }
});
