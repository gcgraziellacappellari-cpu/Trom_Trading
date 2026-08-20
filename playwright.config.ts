import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { banrisul } from './src/brokers/banrisul';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 180_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.BASE_URL ?? banrisul.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO || 0) || undefined,
    },
  },
  projects: [
    {
      name: 'setup-banrisul',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'banrisul',
      testMatch: /tests\/banrisul\/(login|widgets-corretora|idiomas)\//,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
        viewport: { width: 1600, height: 1000 },
        baseURL: banrisul.baseUrl,
      },
    },
    {
      name: 'banrisul-authed',
      testMatch: /tests\/banrisul\/widgets\//,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/banrisul.json',
        viewport: { width: 1600, height: 1000 },
        baseURL: banrisul.baseUrl,
      },
      dependencies: ['setup-banrisul'],
    },
  ],
});
