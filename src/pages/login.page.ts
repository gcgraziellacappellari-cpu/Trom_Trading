import { Page, expect } from '@playwright/test';
import type { BrokerConfig, BrokerLanguage } from '../brokers/types';
import { env } from '../support/env';

export class LoginPage {
  constructor(
    private readonly page: Page,
    private readonly broker?: BrokerConfig,
  ) {}

  private get baseUrl() {
    return this.broker?.baseUrl ?? env.baseUrl;
  }

  readonly userInput = () => this.page.getByRole('textbox', { name: /usu[aá]rio|user|usuario/i });
  readonly passwordInput = () =>
    this.page.getByRole('textbox', { name: /senha|password|contrase[nñ]a/i });
  readonly loginButton = () => this.page.getByRole('button', { name: /entrar|login|iniciar/i });
  readonly formHeading = () => this.page.getByRole('heading', { name: /entrar|login|sesi[oó]n/i });
  readonly rememberCheckbox = () => this.page.locator('#customCheckbox');

  /** Bandeiras de idioma no rodapé (links com imagem). */
  languageFlags() {
    return this.page.locator('a').filter({ has: this.page.locator('img') });
  }

  async goto() {
    await this.page.goto(this.baseUrl);
    await expect(this.userInput()).toBeVisible({ timeout: 45_000 });
  }

  async login(user = env.user, password = env.password, options?: { remember?: boolean }) {
    await this.goto();
    await this.userInput().fill(user);
    await this.passwordInput().fill(password);
    if (options?.remember) {
      await this.rememberCheckbox().click();
    }
    await this.loginButton().click();
    await this.expectLoggedIn();
  }

  async expectLoginFormVisible() {
    await expect(this.formHeading()).toBeVisible({ timeout: 30_000 });
    await expect(this.userInput()).toBeVisible();
    await expect(this.passwordInput()).toBeVisible();
    await expect(this.loginButton()).toBeVisible();
  }

  async expectLoggedIn() {
    await expect(this.page).not.toHaveURL(/\/login/i, { timeout: 60_000 });
    await expect(this.page.locator('iframe[name="iframe_wdma_container_wdma"]')).toBeVisible({
      timeout: 90_000,
    });
  }

  async selectLanguageByFlagIndex(flagIndex: number) {
    const flags = this.languageFlags();
    await expect(flags.first()).toBeVisible({ timeout: 15_000 });
    await flags.nth(flagIndex).click();
  }

  async expectLanguage(language: BrokerLanguage) {
    await expect(this.page.getByRole('heading', { name: language.expected.heading })).toBeVisible({
      timeout: 15_000,
    });
    await expect(this.page.getByRole('textbox', { name: language.expected.user })).toBeVisible();
    await expect(
      this.page.getByRole('textbox', { name: language.expected.password }),
    ).toBeVisible();
    await expect(this.page.getByRole('button', { name: language.expected.button })).toBeVisible();
  }
}
