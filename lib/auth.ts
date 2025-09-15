// lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { loginSchema } from "./validators";
import bcrypt from "bcrypt";
import { onlyDigits } from "./cpf";

// Augmenta tipos para incluir id/cpf na Session e no JWT
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      cpf: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    cpf?: string;
    name?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: !!process.env.AUTH_TRUST_HOST,
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/login" },

  providers: [
    Credentials({
      name: "CPF login",
      credentials: {
        cpf: { label: "CPF", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(creds) {
        // Validação com Zod
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) return null;

        const cpf = onlyDigits(parsed.data.cpf);
        const password = parsed.data.password;

        // Busca usuário pelo CPF (apenas campos necessários)
        const user = await prisma.user.findUnique({
          where: { cpf },
          select: { id: true, name: true, cpf: true, passwordHash: true },
        });
        if (!user || !user.passwordHash) return null;

        // Verifica senha
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Retorna shape mínimo esperado pelo NextAuth
        return { id: user.id, name: user.name, cpf: user.cpf } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name ?? null;
        token.cpf = (user as any).cpf;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: String(token.id),
        cpf: String(token.cpf),
        name: (token.name as string | null) ?? null,
        email: session.user?.email ?? null,
        image: session.user?.image ?? null,
      };
      return session;
    },
  },
});

