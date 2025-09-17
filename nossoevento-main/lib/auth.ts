import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { loginSchema } from "./validators";
import bcrypt from "bcryptjs"; // ⬅️ bcryptjs

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: !!process.env.AUTH_TRUST_HOST,
  secret: process.env.AUTH_SECRET ?? "",
  pages: { signIn: "/auth/login" },
  providers: [
    Credentials({
      name: "CPF login",
      credentials: { cpf: {}, password: {} },
      authorize: async (creds) => {
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) return null;

        const { cpf, password } = parsed.data;
        const only = (cpf ?? "").toString().replace(/\D/g, "");

        const user = await prisma.user.findUnique({ where: { cpf: only } });
        if (!user) return null;

        // ⬇️ bcryptjs (sync é mais simples e 100% JS)
        const ok = bcrypt.compareSync(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          cpf: user.cpf,
          name: user.name,
          email: user.email ?? undefined,
          image: null,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).cpf = (user as any).cpf ?? null;
        token.name = (user as any).name ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user ?? ({} as any);
      (session.user as any).id = (token as any).id ?? null;
      (session.user as any).cpf = (token as any).cpf ?? null;
      (session.user as any).name = token.name ?? null;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

