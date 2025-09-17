// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Evita recriar o client em hot-reload (dev) e em serverless
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const makePrisma = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

export const prisma = global.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Aviso útil no Vercel/preview se esquecer de setar o DATABASE_URL
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "test") {
  console.warn(
    "[prisma] DATABASE_URL não definida. Configure as variáveis no Vercel (Production/Preview)."
  );
}

