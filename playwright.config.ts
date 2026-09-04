import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx serve -l 8080 .',
    url: 'http://127.0.0.1:8080',
    cwd: __dirname,
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
