# TROM E2E — testes por corretora

## Banrisul

```
tests/banrisul/
  login/                 # tela de login + entrar na plataforma
  widgets-corretora/     # widgets do menu PAINEL
  idiomas/               # bandeiras / tradução na login
  widgets/               # cenários por widget (codegen)
```

### Rodar por módulo

```bash
npm run test:banrisul:login
npm run test:banrisul:widgets
npm run test:banrisul:idiomas
```

Com navegador visível:

```bash
npm run test:banrisul:login:headed
npm run test:banrisul:widgets:headed
npm run test:banrisul:idiomas:headed
```

No Playwright UI, selecione o project **banrisul** (não só `setup-banrisul`).
