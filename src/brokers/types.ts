export type BrokerWidget = {
  id: string;
  label: string;
};

export type BrokerLanguage = {
  id: string;
  flagIndex: number;
  expected: {
    heading: RegExp;
    user: RegExp;
    password: RegExp;
    button: RegExp;
  };
};

/** Idioma dentro da plataforma (menu do perfil). */
export type PlatformLanguage = {
  id: string;
  /** Índice em `.icons-language .icon-profile` (0 = primeira). */
  iconIndex: number;
  name: string;
  /** Textos do menu lateral. */
  sidebar: RegExp[];
  /** Textos do dashboard / header. */
  dashboard: RegExp[];
  /** Nomes dos widgets no menu PAINEL (regex para aceitar acentos/variações). */
  painelWidgets: RegExp[];
};

export type BrokerConfig = {
  id: string;
  name: string;
  displayName: string;
  baseUrl: string;
  brandingTexts: RegExp[];
  urlMarker: RegExp;
  widgets: BrokerWidget[];
  languages?: BrokerLanguage[];
  platformLanguages?: PlatformLanguage[];
};
