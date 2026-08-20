import type { BrokerConfig, PlatformLanguage } from './types';

/** Widgets do PAINEL — vocabulário financeiro da corretora/bolsa (PT). */
const painelPt: RegExp[] = [
  /painel de cota[cç][oõ]es/i,
  /gr[aá]fico/i,
  /book de ofertas/i,
  /destaques/i,
  /not[ií]cias/i,
  /cust[oó]dia/i,
  /detalhes de cota[cç][aã]o/i,
  /relat[oó]rio/i,
  /neg[oó]cios/i,
  /lista de ordens/i,
  /produtos|painel de invest/i,
  /extrato/i,
  /nota de corretagem/i,
  /proventos/i,
  /posi[cç][aã]o financeira/i,
  /pre[cç]o m[eé]dio/i,
];

/** Widgets do PAINEL em inglês financeiro (bolsa). */
const painelEn: RegExp[] = [
  /quotes panel/i,
  /chart/i,
  /book offers/i,
  /highlights/i,
  /news/i,
  /custody/i,
  /quote details/i,
  /report/i,
  /trades/i,
  /orders? list/i,
  /investment panel/i,
  /extract|statement/i,
  /brokerage note/i,
  /proceeds|earnings/i,
  /financial position/i,
  /average price/i,
];

/** Widgets do PAINEL em espanhol financeiro. */
const painelEs: RegExp[] = [
  /panel de cotizaci/i,
  /gr[aá]fico/i,
  /libro de ofertas/i,
  /ranking/i,
  /noticias/i,
  /custodia/i,
  /detalles de[l]? cotizaci/i,
  /reporte/i,
  /negocios/i,
  /lista de [oó]rdenes/i,
  /panel de invers|painel de invest|productos/i,
  /extracto/i,
  /nota de corretaje/i,
  /proventos/i,
  /posici[oó]n financiera/i,
  /precio promedio/i,
];

/**
 * Widgets do PAINEL em chinês (termos de mercado / bolsa).
 * Labels reais do catálogo TROM neste ambiente.
 */
const painelZh: RegExp[] = [
  /行情面板/,
  /盘口/,
  /焦点/,
  /新闻/,
  /托管/,
  /行情详情/,
  /报告/,
  /成交明细/,
  /订单列表/,
  /产品/,
  /账户流水/,
  /经纪商结算单/,
  /股息|红利/,
  /资金持仓/,
];

function lang(
  partial: Omit<PlatformLanguage, 'painelWidgets'> & { painelWidgets: RegExp[] },
): PlatformLanguage {
  return partial;
}

/**
 * Corretora Banrisul — URL, nome/logo, widgets do PAINEL e idiomas.
 */
export const banrisul: BrokerConfig = {
  id: 'banrisul',
  name: 'Banrisul',
  displayName: 'banrisul corretora de valores',
  baseUrl: 'https://ctdevwebfrontend.cma.com.br/CMA/TROM/TRADING-BANRISUL',
  urlMarker: /TRADING-BANRISUL/i,
  brandingTexts: [/banrisul/i, /corretora de valores/i],
  widgets: [
    { id: 'painel-de-cotacoes', label: 'PAINEL DE COTAÇÕES' },
    { id: 'grafico', label: 'GRÁFICO' },
    { id: 'book-de-ofertas', label: 'BOOK DE OFERTAS' },
    { id: 'destaques', label: 'DESTAQUES' },
    { id: 'noticias', label: 'NOTÍCIAS' },
    { id: 'custodia', label: 'CUSTÓDIA' },
    { id: 'detalhes-de-cotacao', label: 'DETALHES DE COTAÇÃO' },
    { id: 'relatorio', label: 'RELATÓRIO' },
    { id: 'negocios', label: 'NEGÓCIOS' },
    { id: 'lista-de-ordens', label: 'LISTA DE ORDENS' },
    { id: 'produtos', label: 'PRODUTOS' },
    { id: 'extrato', label: 'EXTRATO' },
    { id: 'nota-de-corretagem', label: 'NOTA DE CORRETAGEM' },
    { id: 'proventos', label: 'PROVENTOS' },
    { id: 'posicao-financeira', label: 'POSIÇÃO FINANCEIRA' },
    { id: 'preco-medio', label: 'PREÇO MÉDIO' },
  ],
  languages: [
    {
      id: 'pt-BR',
      flagIndex: 0,
      expected: {
        heading: /entrar/i,
        user: /usu[aá]rio/i,
        password: /senha/i,
        button: /entrar/i,
      },
    },
    {
      id: 'en',
      flagIndex: 2,
      expected: {
        heading: /login/i,
        user: /user/i,
        password: /password/i,
        button: /login/i,
      },
    },
    {
      id: 'es',
      flagIndex: 1,
      expected: {
        heading: /iniciar sesi[oó]n|entrar/i,
        user: /usuario/i,
        password: /contrase[nñ]a|password/i,
        button: /iniciar|entrar|login/i,
      },
    },
  ],
  /**
   * Idiomas no menu do perfil (após login) — uma entrada por bandeira.
   * `.icons-language .icon-profile`:
   * 0 BR | 1 ES | 2 AR | 3 CO | 4 USA | 5 CN
   *
   * Validação focada em termos financeiros da bolsa (compra/venda, patrimônio,
   * book, ordens, custódia, etc.).
   */
  platformLanguages: [
    lang({
      id: 'pt-BR',
      iconIndex: 0,
      name: 'Português (Brasil)',
      sidebar: [/meus investimentos/i, /negocia[cç][aã]o|fundos de investimento/i],
      dashboard: [/comprar/i, /vender/i, /gr[aá]fico/i],
      painelWidgets: painelPt,
    }),
    lang({
      id: 'es-ES',
      iconIndex: 1,
      name: 'Español (España)',
      sidebar: [/mis inversiones/i, /trading|acciones/i],
      dashboard: [/patrimonio total/i, /comprar/i, /vender/i],
      painelWidgets: painelEs,
    }),
    lang({
      id: 'es-AR',
      iconIndex: 2,
      name: 'Español (Argentina)',
      // Nesta build a bandeira 2 aplica UI em espanhol (vocabulário financeiro ES).
      sidebar: [/mis inversiones/i, /trading|acciones/i],
      dashboard: [/patrimonio total/i, /comprar/i, /vender/i],
      painelWidgets: painelEs,
    }),
    lang({
      id: 'es-CO',
      iconIndex: 3,
      name: 'Español (Colombia)',
      sidebar: [/mis inversiones/i, /trading|acciones/i],
      dashboard: [/patrimonio total/i, /comprar/i, /vender/i],
      painelWidgets: painelEs,
    }),
    lang({
      id: 'en-US',
      iconIndex: 4,
      name: 'English (USA)',
      sidebar: [/dashboard|equities|trading/i, /investment funds|fixed income/i],
      dashboard: [/total portfolio/i, /buy/i, /sell/i],
      painelWidgets: painelEn,
    }),
    lang({
      id: 'zh-CN',
      iconIndex: 5,
      name: '中文 (China)',
      sidebar: [/我的投资/, /交易|股票|投资基金/],
      dashboard: [/总资产/, /买入/, /卖出/],
      painelWidgets: painelZh,
    }),
  ],
};
