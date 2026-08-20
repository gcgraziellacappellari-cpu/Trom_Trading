import { FrameLocator, Page, expect } from '@playwright/test';
import type { BrokerConfig } from '../brokers/types';

/**
 * A plataforma TROM roda dentro do iframe `iframe_wdma_container_wdma`.
 */
export class PlatformPage {
  constructor(
    private readonly page: Page,
    private readonly broker: BrokerConfig,
  ) {}

  appFrame(): FrameLocator {
    return this.page.frameLocator('iframe[name="iframe_wdma_container_wdma"]');
  }

  async goto() {
    await this.page.goto(this.broker.baseUrl);
    await this.expectPlatformReady();
  }

  async expectPlatformReady() {
    await expect(this.page).not.toHaveURL(/\/login/i, { timeout: 60_000 });
    await expect(this.page.locator('iframe[name="iframe_wdma_container_wdma"]')).toBeVisible({
      timeout: 90_000,
    });
  }

  async expectBrokerIdentity() {
    await expect(this.page).toHaveURL(this.broker.urlMarker);

    const frame = this.appFrame();
    await expect(frame.getByText(/banrisul/i).filter({ visible: true }).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      frame.getByText(/corretora de valores/i).filter({ visible: true }).first(),
    ).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Abre a lista de widgets do PAINEL.
   * Codegen: options → "Painel de Cotações".
   * Tenta cada ícone options até a lista (BOOK DE OFERTAS) aparecer.
   */
  async openWidgetsPanel() {
    const frame = this.appFrame();
    const options = frame.locator('.icon-wrapper.box-header-icon.options > span > svg');
    await expect(options.first()).toBeVisible({ timeout: 30_000 });

    const total = await options.count();

    for (let i = 0; i < total; i++) {
      await options.nth(i).click();

      const painelTitle = frame.getByText(/^Painel$/i).filter({ visible: true });
      try {
        await expect(painelTitle.first()).toBeVisible({ timeout: 5_000 });
      } catch {
        continue;
      }

      const painelCotacoes = frame.getByText('Painel de Cotações', { exact: true });
      if ((await painelCotacoes.count()) > 0) {
        await painelCotacoes.first().click();
      } else {
        await painelTitle
          .first()
          .locator('xpath=ancestor::*[2]')
          .getByText(/Notícias|Gráfico|Destaques/i)
          .first()
          .click();
      }

      const book = frame.getByText(/BOOK DE OFERTAS/i);
      try {
        await expect(book.first()).toBeVisible({ timeout: 8_000 });
        return;
      } catch {
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(400);
      }
    }

    throw new Error('Não foi possível abrir a lista de widgets do PAINEL');
  }

  async expectBrokerNameAndWidgets() {
    await this.expectBrokerIdentity();
    await this.expectAllWidgetsAvailable();
  }

  async expectAllWidgetsAvailable() {
    await this.openWidgetsPanel();

    const frame = this.appFrame();

    for (const widget of this.broker.widgets) {
      const pattern = new RegExp(escapeRegExp(widget.label), 'i');
      await expect(
        frame.getByText(pattern).first(),
        `Widget ausente no PAINEL de ${this.broker.name}: ${widget.label}`,
      ).toBeVisible({ timeout: 10_000 });
    }
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
