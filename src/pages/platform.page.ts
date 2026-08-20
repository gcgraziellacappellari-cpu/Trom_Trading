import { FrameLocator, Page, expect } from '@playwright/test';
import type { BrokerConfig, PlatformLanguage } from '../brokers/types';
import { env } from '../support/env';

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

  /** Abre o menu do perfil (codegen: clique no usuário). */
  async openProfileMenu() {
    const frame = this.appFrame();
    const userId = env.user;
    await frame.locator('div').filter({ hasText: new RegExp(`^${userId}$`) }).nth(2).click();
    await expect(frame.locator('.icons-language .icon-profile').first()).toBeVisible({
      timeout: 15_000,
    });
  }

  /**
   * Seleciona idioma no menu do perfil.
   * Codegen: `.icons-language > .icon-profile...`
   */
  async selectPlatformLanguage(language: PlatformLanguage) {
    await this.openProfileMenu();
    const flags = this.appFrame().locator('.icons-language .icon-profile');
    await expect(flags.first()).toBeVisible({ timeout: 10_000 });
    await flags.nth(language.iconIndex).click();
    await this.page.waitForTimeout(4_000);
    // Fecha o menu do perfil para não interceptar cliques nos widgets
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(400);
    await this.expectPlatformReady();
  }

  /** Valida textos do menu lateral e do dashboard no idioma escolhido. */
  async expectDashboardTranslated(language: PlatformLanguage) {
    const frame = this.appFrame();

    for (const text of language.sidebar) {
      await expect(
        frame.getByText(text).filter({ visible: true }).first(),
        `Sidebar não traduzida (${language.name}): ${text}`,
      ).toBeVisible({ timeout: 20_000 });
    }

    for (const text of language.dashboard) {
      await expect(
        frame.getByText(text).filter({ visible: true }).first(),
        `Dashboard não traduzido (${language.name}): ${text}`,
      ).toBeVisible({ timeout: 20_000 });
    }
  }

  /**
   * Abre a lista de widgets do PAINEL.
   * Codegen: options → tipo atual (ex. "Painel de Cotações").
   */
  async openWidgetsPanel(
    preferredTypeNames: string[] = [
      'Painel de Cotações',
      'Quotes Panel',
      'Quotation Panel',
      'QUOTES PANEL',
      'BOOK OFFERS',
      'Panel de Cotización',
      'Panel de Cotizaciones',
      'PANEL DE COTIZACIÓN',
      'LIBRO DE OFERTAS',
    ],
  ) {
    const frame = this.appFrame();
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);

    const options = frame.locator('.icon-wrapper.box-header-icon.options > span > svg');
    await expect(options.first()).toBeVisible({ timeout: 30_000 });

    const total = await options.count();

    const catalogIsOpen = async () => {
      // Catálogo completo: vários tipos de widget na mesma lista
      const custody = frame.getByText(/CUST[OÓ]DIA|CUSTODY/i).filter({ visible: true });
      const news = frame.getByText(/NOT[IÍ]CIAS|NEWS|NOTICIAS/i).filter({ visible: true });
      const book = frame.getByText(/BOOK DE OFERTAS|ORDER BOOK|LIBRO DE OFERTAS|BOOK OFFERS/i).filter({
        visible: true,
      });
      const orders = frame.getByText(/LISTA DE ORDENS|ORDER LIST|LISTA DE [OÓ]RDENES/i).filter({
        visible: true,
      });
      const visibleCount =
        Number(await custody.count().then((c) => (c > 0 ? 1 : 0))) +
        Number(await news.count().then((c) => (c > 0 ? 1 : 0))) +
        Number(await book.count().then((c) => (c > 0 ? 1 : 0))) +
        Number(await orders.count().then((c) => (c > 0 ? 1 : 0)));
      return visibleCount >= 2;
    };

    for (let i = 0; i < total; i++) {
      await options.nth(i).click({ force: true });

      const painelTitle = frame.getByText(/^Painel$|^Panel$|^Widgets$/i).filter({ visible: true });
      try {
        await expect(painelTitle.first()).toBeVisible({ timeout: 4_000 });
      } catch {
        continue;
      }

      // Expande o seletor de tipo (ex.: "BOOK OFFERS >") para ver todos os widgets
      for (const name of preferredTypeNames) {
        const type = frame.getByText(name, { exact: false });
        if ((await type.count()) > 0) {
          await type.first().click({ force: true }).catch(() => {});
          await this.page.waitForTimeout(500);
          if (await catalogIsOpen()) return;
        }
      }

      // Fallback: qualquer item típico do catálogo
      const fallback = frame.getByText(
        /not[ií]cias|news|noticias|ranking|highlights|destaques|cust[oó]dia|custody|book offers|libro de ofertas/i,
      );
      if ((await fallback.count()) > 0) {
        await fallback.first().click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(500);
      }

      if (await catalogIsOpen()) return;

      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(300);
    }

    throw new Error('Não foi possível abrir a lista de widgets do PAINEL');
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

  /** Valida tradução de cada widget no menu PAINEL para o idioma. */
  async expectPainelWidgetsTranslated(language: PlatformLanguage) {
    await this.openWidgetsPanel();
    const frame = this.appFrame();

    for (const pattern of language.painelWidgets) {
      const candidates = frame.getByText(pattern);
      const count = await candidates.count();
      let found = false;
      for (let i = 0; i < count; i++) {
        const el = candidates.nth(i);
        await el.scrollIntoViewIfNeeded().catch(() => {});
        if (await el.isVisible().catch(() => false)) {
          found = true;
          break;
        }
      }
      expect(found, `Widget não traduzido (${language.name}): ${pattern}`).toBeTruthy();
    }
  }

  async expectBrokerNameAndWidgets() {
    await this.expectBrokerIdentity();
    await this.expectAllWidgetsAvailable();
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
