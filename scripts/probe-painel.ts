import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(process.env.BASE_URL!);
  await page.getByRole('textbox', { name: /usu[aá]rio|user/i }).fill(process.env.TROM_USER!);
  await page.getByRole('textbox', { name: /senha|password/i }).fill(process.env.TROM_PASSWORD!);
  await page.locator('#customCheckbox').click().catch(() => {});
  await page.getByRole('button', { name: /entrar|login/i }).click();
  await page.locator('iframe[name="iframe_wdma_container_wdma"]').waitFor({ timeout: 90_000 });
  await page.waitForTimeout(10000);

  const frame = page.frame({ name: 'iframe_wdma_container_wdma' })!;
  const fl = page.frameLocator('iframe[name="iframe_wdma_container_wdma"]');

  // Hover no widget Meus Ativos / Minha Carteira
  const carteira = fl.getByText('Minha Carteira', { exact: true }).first();
  await carteira.hover();
  await page.waitForTimeout(800);

  let options = fl.locator('.icon-wrapper.box-header-icon.options');
  console.log('options after hover carteira', await options.count());

  // Hover área do meio-esquerda do widget
  await page.mouse.move(400, 80);
  await page.waitForTimeout(500);
  console.log('options after move', await options.count());

  // Clica no wrapper options (não só o svg) — first visível
  const opt = fl.locator('.icon-wrapper.box-header-icon.options').first();
  await opt.click({ timeout: 10_000 });
  await page.waitForTimeout(1500);
  let text = await frame.innerText('body');
  console.log('after options wrapper click', {
    painel: /\bPainel\b/.test(text),
    painelCotacoes: text.includes('Painel de Cotações'),
    visualizacao: text.includes('Visualização'),
    noticias: text.includes('Notícias'),
  });
  await page.screenshot({ path: 'playwright/.auth/hover-opt.png' });

  if (text.includes('Painel de Cotações')) {
    await fl.getByText('Painel de Cotações', { exact: true }).click();
  } else if (/\bPainel\b/.test(text)) {
    await fl
      .getByText(/^Painel$/i)
      .filter({ visible: true })
      .first()
      .locator('xpath=ancestor::*[2]')
      .getByText(/Notícias|Gráfico|Painel de Cotações/i)
      .first()
      .click();
  }

  await page.waitForTimeout(1500);
  text = await frame.innerText('body');
  const widgets = [
    'PAINEL DE COTAÇÕES',
    'BOOK DE OFERTAS',
    'LISTA DE ORDENS',
    'CUSTÓDIA',
    'PREÇO MÉDIO',
    'DETALHES DE COTAÇÃO',
  ];
  console.log(
    'widget hits',
    widgets.map((w) => [w, text.includes(w)]),
  );
  console.log('snippet', text.match(/Painel[\s\S]{0,1200}/i)?.[0]?.slice(0, 800));
  await page.screenshot({ path: 'playwright/.auth/hover-after.png' });

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
