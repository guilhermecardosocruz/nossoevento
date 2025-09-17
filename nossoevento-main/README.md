# Nosso Evento — v11 (Neon + Vercel)

MVP com login/cadastro por **CPF**, NextAuth v5 (credentials), Prisma + Postgres (Neon), PWA básico.

## Rodar localmente

```bash
# 1) Dependências
pnpm install

# 2) Prisma (gera client e aplica migrações)
pnpm prisma generate
pnpm prisma migrate deploy   # usa DIRECT_URL configurada no .env
pnpm seed                    # cria usuário demo (opcional)

# 3) Dev
pnpm dev              # http://localhost:3000
# ou expor p/ celular
pnpm dev:mobile

