export type BrokerWidget = {
  id: string;
  /** Nome exato do widget no menu PAINEL. */
  label: string;
};

export type BrokerLanguage = {
  id: string;
  /** Índice da bandeira no rodapé da login (0 = primeira à esquerda). */
  flagIndex: number;
  expected: {
    heading: RegExp;
    user: RegExp;
    password: RegExp;
    button: RegExp;
  };
};

export type BrokerConfig = {
  id: string;
  name: string;
  /** Nome completo exibido no header/logo. */
  displayName: string;
  baseUrl: string;
  /** Textos que identificam a corretora (logo/splash/header). */
  brandingTexts: RegExp[];
  /** Trecho obrigatório na URL. */
  urlMarker: RegExp;
  /** Widgets disponíveis no menu PAINEL desta corretora. */
  widgets: BrokerWidget[];
  /** Idiomas testáveis na tela de login (bandeiras). */
  languages?: BrokerLanguage[];
};
