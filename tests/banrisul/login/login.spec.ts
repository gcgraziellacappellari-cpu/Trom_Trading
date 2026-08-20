import { test, expect } from '@playwright/test';
import { banrisul } from '../../../src/brokers/banrisul';
import { LoginPage } from '../../../src/pages/login.page';
import { PlatformPage } from '../../../src/pages/platform.page';
import { zohoNote } from '../../../src/support/zoho';

test.describe('Banrisul — Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.setTimeout(120_000);

  test('exibe campos de usuário, senha e botão Entrar', async ({ page }) => {
    const login = new LoginPage(page, banrisul);
    await login.goto();
    await login.expectLoginFormVisible();
    await expect(page).toHaveURL(banrisul.urlMarker);

    zohoNote({
      modulo: 'Banrisul / Login',
      cenario: 'Campos visíveis',
      observacao: 'Formulário de autenticação exibido.',
    });
  });

  test('realiza login e entra na plataforma Banrisul', async ({ page }) => {
    const login = new LoginPage(page, banrisul);
    const platform = new PlatformPage(page, banrisul);

    await login.login(undefined, undefined, { remember: true });
    await platform.expectBrokerIdentity();

    zohoNote({
      modulo: 'Banrisul / Login',
      cenario: 'Login com sucesso',
      observacao: banrisul.displayName,
    });
  });
});
