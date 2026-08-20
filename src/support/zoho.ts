/**
 * Ponto único para anotar evidências alinhadas ao fluxo atual no Zoho.
 * Use nos testes quando quiser deixar um registro estruturado no relatório do Playwright.
 */
export function zohoNote(params: {
  modulo: string;
  cenario: string;
  observacao: string;
  zohoId?: string;
}) {
  const id = params.zohoId ? ` [${params.zohoId}]` : '';
  console.log(`[Zoho]${id} ${params.modulo} | ${params.cenario}: ${params.observacao}`);
}
