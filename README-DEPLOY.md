# Deploy Kit — Next.js + Prisma + Stripe (Vercel + Neon)

## Passo a passo
1. **Copie** os arquivos deste pacote para a raiz do seu projeto (preservando caminhos).
2. **Ajuste variáveis** no Vercel (Project → Settings → Environment Variables):
   - `DATABASE_URL` (pooler) e `DIRECT_URL` (direta), `NEXTAUTH_SECRET`,
     `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
     `UPLOADTHING_TOKEN`, etc.
3. **GitHub Secrets/Environments**:
   - `DATABASE_URL`, `DIRECT_URL`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, e demais.
4. **Scripts do package.json**:
   - Mescle o conteúdo de `package.scripts.merge.json` no seu `package.json`.
5. **Stripe Webhook**:
   - Endpoint: `/api/stripe/webhook` (Production/Preview). Configure o `STRIPE_WEBHOOK_SECRET` no Vercel.
6. **Banco local (opcional)**:
   - `docker compose up -d` para subir Postgres local.
7. **Sanitização HTML**:
   - Use `sanitizeHtml` em qualquer uso de `dangerouslySetInnerHTML`.
8. **Security headers**:
   - Ajuste a CSP no `middleware.ts` conforme integrações necessárias.

## Pipelines
- CI: build, lint, typecheck, tests.
- CD: `prisma migrate deploy` (com `DIRECT_URL`) + deploy Vercel + seed opcional.

## Observabilidade
- Configure Log Drains/Vercel Analytics; trate idempotência no webhook.
