import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { banrisul } from '../src/brokers/banrisul';
import { LoginPage } from '../src/pages/login.page';
import { env } from '../src/support/env';

const authFile = path.resolve(__dirname, '../playwright/.auth/banrisul.json');

setup('Banrisul — autentica e salva sessão', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  expect(env.user, 'Defina TROM_USER no .env').toBeTruthy();
  expect(env.password, 'Defina TROM_PASSWORD no .env').toBeTruthy();

  const login = new LoginPage(page, banrisul);
  await login.login(undefined, undefined, { remember: true });
  await page.context().storageState({ path: authFile });
});
