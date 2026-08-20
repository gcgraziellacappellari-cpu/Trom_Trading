import { test } from '@playwright/test';
import { banrisul } from '../../../../src/brokers/banrisul';
import { PlatformPage } from '../../../../src/pages/platform.page';
import { zohoNote } from '../../../../src/support/zoho';

test.describe('Banrisul — Widget: Negócios', () => {
  test('placeholder — gravar fluxo com codegen', async ({ page }) => {
    test.skip(true, 'Aguardando codegen do widget Negócios.');
    const platform = new PlatformPage(page, banrisul);
    await platform.goto();
    zohoNote({
      modulo: 'Banrisul / Negócios',
      cenario: 'Abertura',
      observacao: 'Substituir pelo codegen.',
    });
  });
});
