import { test, expect } from '@playwright/test';
import { banrisul } from '../../../../src/brokers/banrisul';
import { PlatformPage } from '../../../../src/pages/platform.page';
import { zohoNote } from '../../../../src/support/zoho';

test.describe('Banrisul — Widget: Lista de ordens', () => {
  test('placeholder — gravar fluxo com codegen', async ({ page }) => {
    test.skip(true, 'Aguardando codegen do widget Lista de ordens.');
    const platform = new PlatformPage(page, banrisul);
    await platform.goto();
    zohoNote({
      modulo: 'Banrisul / Lista de ordens',
      cenario: 'Abertura',
      observacao: 'Substituir pelo codegen.',
    });
  });
});
