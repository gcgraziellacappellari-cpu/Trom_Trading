import { test, expect } from '@playwright/test';
import { banrisul } from '../../../src/brokers/banrisul';
import { LoginPage } from '../../../src/pages/login.page';
import { zohoNote } from '../../../src/support/zoho';

test.describe('Banrisul — Idiomas', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('exibe bandeiras de idioma na tela de login', async ({ page }) => {
    const login = new LoginPage(page, banrisul);
    await login.goto();

    const flags = login.languageFlags();
    await expect(flags.first()).toBeVisible({ timeout: 15_000 });
    await expect(flags).toHaveCount(6);

    zohoNote({
      modulo: 'Banrisul / Idiomas',
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
      modulo: 'Banrisul / Idiomas',
      cenario: 'Troca PT/EN',
      observacao: 'Labels da login traduzidos conforme bandeira.',
    });
  });

  test('alterna idioma para espanhol na tela de login', async ({ page }) => {
    const login = new LoginPage(page, banrisul);
    await login.goto();

    const es = banrisul.languages!.find((l) => l.id === 'es')!;
    await login.selectLanguageByFlagIndex(es.flagIndex);
    await login.expectLanguage(es);

    zohoNote({
      modulo: 'Banrisul / Idiomas',
      cenario: 'Troca para ES',
      observacao: 'Labels da login em espanhol.',
    });
  });
});
