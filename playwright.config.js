import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 180_000,
  expect: { timeout: 120_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    headless: true,
    acceptDownloads: true,
  },
  webServer: {
    command: 'npx serve -l 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
