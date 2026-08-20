import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

  await page.goto(process.env.BASE_URL!);
  await page.getByRole('textbox', { name: /usu[aá]rio|user/i }).fill(process.env.TROM_USER!);
  await page.getByRole('textbox', { name: /senha|password/i }).fill(process.env.TROM_PASSWORD!);
  await page.getByRole('button', { name: /entrar|login/i }).click();

  await page.locator('iframe[name="iframe_wdma_container_wdma"]').waitFor({ timeout: 90_000 });
  await page.waitForTimeout(10_000);

  const frame = page.frame({ name: 'iframe_wdma_container_wdma' });
  if (!frame) throw new Error('iframe não encontrado');

  const outer = {
    title: await page.title(),
    url: page.url(),
    outerText: await page.locator('body').innerText().catch(() => ''),
  };

  const innerText = await frame.locator('body').innerText();
  const imgs = await frame.locator('img').evaluateAll((nodes) =>
    nodes.slice(0, 40).map((n) => ({
      src: (n as HTMLImageElement).src,
      alt: (n as HTMLImageElement).alt,
    })),
  );

  // Títulos de janelas/widgets comuns em WDMA
  const candidates = await frame.evaluate(() => {
    const out: string[] = [];
    const selectors = [
      '[class*="window"] [class*="title"]',
      '[class*="widget"] [class*="title"]',
      '[class*="panel"] [class*="title"]',
      '.wdma-window-title',
      '[class*="WindowTitle"]',
      'header',
      '[title]',
    ];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        const t = (el.getAttribute('title') || el.textContent || '').trim().replace(/\s+/g, ' ');
        if (t && t.length < 80) out.push(t);
      });
    }
    return [...new Set(out)].slice(0, 100);
  });

  const lines = innerText
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 1 && l.length < 50);

  const result = {
    outer,
    banrisulInText: /banrisul/i.test(innerText) || /banrisul/i.test(outer.outerText),
    imgs,
    candidates,
    uniqueLines: [...new Set(lines)].slice(0, 150),
  };

  fs.mkdirSync('playwright/.auth', { recursive: true });
  fs.writeFileSync('playwright/.auth/banrisul-widgets.json', JSON.stringify(result, null, 2));
  await page.screenshot({ path: 'playwright/.auth/banrisul-dashboard.png' });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
