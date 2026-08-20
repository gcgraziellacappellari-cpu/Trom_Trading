import { test } from '@playwright/test';
import { banrisul } from '../../../src/brokers/banrisul';
import { LoginPage } from '../../../src/pages/login.page';
import { PlatformPage } from '../../../src/pages/platform.page';
import { zohoNote } from '../../../src/support/zoho';

/**
 * Idiomas DENTRO da plataforma (menu do perfil → cada bandeira).
 * Codegen: clique no usuário → `.icons-language .icon-profile`
 *
 * Foco da validação: vocabulário financeiro da bolsa (compra/venda, patrimônio,
 * book de ofertas, ordens, custódia, widgets do PAINEL, etc.).
 */
test.describe('Banrisul — Idiomas na plataforma', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.setTimeout(180_000);

  for (const language of banrisul.platformLanguages ?? []) {
    test(`bandeira ${language.name}: termos financeiros e widgets`, async ({ page }) => {
      const login = new LoginPage(page, banrisul);
      const platform = new PlatformPage(page, banrisul);

      await login.login(undefined, undefined, { remember: true });
      await platform.expectBrokerIdentity();

      await platform.selectPlatformLanguage(language);
      await platform.expectDashboardTranslated(language);
      await platform.expectPainelWidgetsTranslated(language);

      zohoNote({
        modulo: 'Banrisul / Idiomas plataforma',
        cenario: language.name,
        observacao: `Termos financeiros + ${language.painelWidgets.length} widgets do PAINEL`,
      });
    });
  }
});
