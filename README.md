# Nosso Evento — v11 (completo)

MVP com login/cadastro por **CPF**, NextAuth v5 (credentials), Prisma + Postgres (Docker), PWA básico.
**Porta do Postgres: 5435** (evita conflitos com 5433/5434).

## Rodar

```bash
# 1) Banco (5435)
docker compose up -d || sudo docker-compose up -d

# 2) Dependências
pnpm install
pnpm approve-builds   # aprove prisma/@prisma/client/@prisma/engines/bcrypt

# 3) Prisma
pnpm prisma generate
pnpm prisma migrate dev -n init
pnpm seed   # cria usuário demo: CPF 123.456.789-09 (use sem pontuação) / senha: senha123

# 4) Dev
pnpm dev              # http://localhost:3000
# ou expor p/ celular
pnpm dev:mobile
```

### Rotas
- `/auth/register`
- `/auth/login` → redireciona para `/ingressos` após login
- `/ingressos` (protegida) → "Você conseguiu, {nome} 🎉"
- `/eventos` → "Ainda não há eventos cadastrados"

### Dicas
- Se mudar `DATABASE_URL`, reinicie `pnpm dev`.
- Erro P1001? Verifique se o container `db` está ativo e ouvindo em 5435.
- Erro de tabela? Rode `pnpm prisma migrate dev -n init`.
- Conferir portas: `sudo ss -lntp | egrep ':5432|:5433|:5434|:5435'`.

### Segurança
- NUNCA commitar `.env` com segredos reais.
- Em produção, gere `AUTH_SECRET` forte e use HTTPS.
