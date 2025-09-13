import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { loginSchema } from "./validators";
import bcrypt from "bcrypt";

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: !!process.env.AUTH_TRUST_HOST,
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/login" },
  providers: [
    Credentials({
      name: "CPF login",
      credentials: { cpf: {}, password: {} },
      async authorize(creds) {
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) return null;

        const { cpf, password } = parsed.data;
        const only = (cpf ?? "").toString().replace(/\D/g, "");

        const user = await prisma.user.findUnique({ where: { cpf: only } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, name: user.name, cpf: user.cpf } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.cpf = (user as any).cpf;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user ?? ({} as any);
      (session.user as any).id = token.id;
      (session.user as any).name = token.name;
      (session.user as any).cpf = token.cpf;
      return session;
    },
  },
});

