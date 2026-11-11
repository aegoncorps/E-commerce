# Aegon Store

Front-end da loja Aegon em Vue 3 e Vite.

A versão atual está no `package.json`; o histórico de alterações fica em [CHANGELOG.md](CHANGELOG.md). Versões `preview` identificam funcionalidades em desenvolvimento antes do lançamento estável.

## Ambientes

| Ambiente | Como é usado | Comando / gatilho |
| --- | --- | --- |
| Local | Desenvolvimento no computador | `npm run dev:local` |
| Preview | Revisão de pull requests para `main` | Deploy automático da Vercel |
| Produção | Versão publicada da loja | Merge/push em `main` → Vercel |

Comece copiando o exemplo de ambiente:

```powershell
Copy-Item .env.example .env.local
npm ci
npm run dev:local
```

## Verificações locais

```powershell
npm run typecheck
npm test
npm run build:dev
```

`npm run build` é a compilação de produção. Os arquivos `.env.local` e as credenciais da Vercel nunca devem ser versionados.

## CI/CD

Os workflows ficam em `.github/workflows`:

- `quality-gate.yml`: executa em pull requests para `develop` ou `main` e valida TypeScript, testes e build de desenvolvimento antes do merge.

A Vercel já conectada ao repositório cuida do deploy: cada pull request recebe um Preview e cada atualização na `main` publica a Produção. Não é necessário configurar `VERCEL_TOKEN`, `VERCEL_ORG_ID` ou `VERCEL_PROJECT_ID` no GitHub.

Variáveis públicas que começam com `VITE_` devem ser configuradas diretamente nos ambientes Preview e Production da Vercel; não use esse prefixo para dados sensíveis.

O `vercel.json` mantém o fallback de SPA para que links como `/produto/10` funcionem diretamente em Preview e Produção.
