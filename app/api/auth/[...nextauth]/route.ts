// Força execução em runtime Node.js (necessário para NextAuth com credenciais)
export const runtime = 'nodejs';

// Garante que essa rota seja sempre dinâmica
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handlers } from '@/lib/auth';

// Reexporta os handlers GET e POST do NextAuth
export const { GET, POST } = handlers;

