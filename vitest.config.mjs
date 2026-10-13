import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.js'],
    exclude: ['tests/e2e/**'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
