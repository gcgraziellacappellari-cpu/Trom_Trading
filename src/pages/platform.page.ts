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
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);

    const candidates = [
      frame.locator('div').filter({ hasText: new RegExp(`^${userId}$`) }).nth(2),
      frame.getByText(userId, { exact: true }).first(),
    ];

    for (const candidate of candidates) {
      try {
        await candidate.click({ timeout: 5_000 });
        await expect(frame.locator('.icons-language .icon-profile').first()).toBeVisible({
          timeout: 8_000,
        });
        return;
      } catch {
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(300);
      }
    }

    throw new Error('Não foi possível abrir o menu de idioma do perfil');
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
      '报价面板',
      '报价板',
      '行情面板',
      '盘口',
      '面板',
    ],
  ) {
    const frame = this.appFrame();
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);

    const options = frame.locator('.icon-wrapper.box-header-icon.options > span > svg');
    await expect(options.first()).toBeVisible({ timeout: 30_000 });

    const total = await options.count();

    const catalogIsOpen = async () => {
      // Catálogo completo: vários tipos de widget financeiro na mesma lista
      const markers = [
        frame.getByText(/CUST[OÓ]DIA|CUSTODY|托管/i).filter({ visible: true }),
        frame.getByText(/NOT[IÍ]CIAS|NEWS|NOTICIAS|新闻/i).filter({ visible: true }),
        frame
          .getByText(/BOOK DE OFERTAS|ORDER BOOK|LIBRO DE OFERTAS|BOOK OFFERS|盘口|买卖盘|报价簿|行情面板/i)
          .filter({ visible: true }),
        frame
          .getByText(/LISTA DE ORDENS|ORDER LIST|LISTA DE [OÓ]RDENES|ORDERS LIST|订单|成交/i)
          .filter({ visible: true }),
      ];
      let visibleCount = 0;
      for (const marker of markers) {
        if ((await marker.count()) > 0) visibleCount += 1;
      }
      return visibleCount >= 2;
    };

    for (let i = 0; i < total; i++) {
      await options.nth(i).click({ force: true });

      const painelTitle = frame
        .getByText(/^Painel$|^Panel$|^Widgets$|^面板$/i)
        .filter({ visible: true });
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

      // Fallback: qualquer item típico do catálogo financeiro
      const fallback = frame.getByText(
        /not[ií]cias|news|noticias|新闻|ranking|highlights|destaques|cust[oó]dia|custody|托管|book offers|libro de ofertas|盘口|报价|行情面板/i,
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
      if (!found) {
        // Ajuda a calibrar labels reais do catálogo (ex.: chinês)
        const body = await frame.locator('body').innerText();
        const lines = [...new Set(body.split(/\n+/).map((s) => s.trim()).filter(Boolean))];
        const start = lines.findIndex((l) => /^(Painel|Panel|Widgets|面板)$/i.test(l));
        const slice = lines.slice(Math.max(0, start), start >= 0 ? start + 30 : 40);
        expect(
          found,
          `Widget não traduzido (${language.name}): ${pattern}\nCatálogo aproximado:\n${slice.join('\n')}`,
        ).toBeTruthy();
      }
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
