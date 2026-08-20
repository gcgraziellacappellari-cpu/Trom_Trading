import { test, expect } from '@playwright/test';
import { banrisul } from '../../../src/brokers/banrisul';
import { LoginPage } from '../../../src/pages/login.page';
import { zohoNote } from '../../../src/support/zoho';

/** Idiomas na tela de LOGIN (bandeiras do rodapé). */
test.describe('Banrisul — Idiomas na login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('exibe bandeiras de idioma na tela de login', async ({ page }) => {
    const login = new LoginPage(page, banrisul);
    await login.goto();

    const flags = login.languageFlags();
    await expect(flags.first()).toBeVisible({ timeout: 15_000 });
    await expect(flags).toHaveCount(6);

    zohoNote({
      modulo: 'Banrisul / Idiomas login',
      cenario: 'Bandeiras visíveis',
      observacao: '6 bandeiras no rodapé da login.',
    });
  });

  test('alterna idioma PT -> EN -> PT na tela de login', async ({ page }) => {
    const login = new LoginPage(page, banrisul);
    await login.goto();

    const pt = banrisul.languages!.find((l) => l.id === 'pt-BR')!;
    const en = banrisul.languages!.find((l) => l.id === 'en')!;

    await login.selectLanguageByFlagIndex(en.flagIndex);
    await login.expectLanguage(en);

    await login.selectLanguageByFlagIndex(pt.flagIndex);
    await login.expectLanguage(pt);

    zohoNote({
      modulo: 'Banrisul / Idiomas login',
      cenario: 'Troca PT/EN',
      observacao: 'Labels da login traduzidos conforme bandeira.',
    });
  });
});
