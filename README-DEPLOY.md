# 🚀 Deploy — Next.js + Prisma + Neon (Vercel)

## Passo a passo

1. **Configurar variáveis no Vercel**  
   Em **Project → Settings → Environment Variables**, defina:

   ```env
   DATABASE_URL="postgresql://<user>:<pass>@ep-flat-feather-adrhmf30-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15"
   DIRECT_URL="postgresql://<user>:<pass>@ep-flat-feather-adrhmf30.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
   NEXT_PUBLIC_APP_URL=https://nossoevento-git-main-guilhermes-projects-b92ea6f9.vercel.app
   AUTH_SECRET=<gerar com openssl rand -base64 32>
   AUTH_TRUST_HOST=true

