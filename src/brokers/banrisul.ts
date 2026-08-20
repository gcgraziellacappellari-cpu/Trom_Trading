import type { BrokerConfig } from './types';

/**
 * Corretora Banrisul — URL, nome/logo, widgets do PAINEL e idiomas da tela de login.
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
  /**
   * Bandeiras no rodapé da login (índice da esquerda para a direita).
   * 0 BR | 1 ES | 2 EN | 3 AR | 4 CO | 5 ZH
   */
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
        user: /usuario|usuario/i,
        password: /contrase[nñ]a|password/i,
        button: /iniciar|entrar|login/i,
      },
    },
  ],
};
