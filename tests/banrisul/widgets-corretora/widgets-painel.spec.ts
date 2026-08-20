import { test } from '@playwright/test';
import { banrisul } from '../../../src/brokers/banrisul';
import { LoginPage } from '../../../src/pages/login.page';
import { PlatformPage } from '../../../src/pages/platform.page';
import { zohoNote } from '../../../src/support/zoho';

test.describe('Banrisul — Widgets da corretora', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.setTimeout(120_000);

  test('valida widgets disponíveis no menu PAINEL', async ({ page }) => {
    const login = new LoginPage(page, banrisul);
    const platform = new PlatformPage(page, banrisul);

    await login.login(undefined, undefined, { remember: true });
    await platform.expectBrokerIdentity();
    await platform.expectAllWidgetsAvailable();

    zohoNote({
      modulo: 'Banrisul / Widgets',
      cenario: 'Widgets do PAINEL',
      observacao: banrisul.widgets.map((w) => w.label).join(', '),
    });
  });
});
