// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/** Helpers */
const onlyDigits = (s: string) => String(s ?? "").replace(/\D/g, "");

/** Seeds */
async function seedUserDemo() {
  const cpf = onlyDigits("123.456.789-09"); // CPF de exemplo (válido)
  const passwordHash = await bcrypt.hash("senha123", 10);

  await prisma.user.upsert({
    where: { cpf }, // UNIQUE por cpf
    update: {
      name: "Usuário Demo",
      email: "demo@nossoevento.test",
      phone: onlyDigits("(11) 99999-0000"),
      passwordHash,
    },
    create: {
      cpf,
      name: "Usuário Demo",
      email: "demo@nossoevento.test",
      phone: onlyDigits("(11) 99999-0000"),
      passwordHash,
    },
  });

  console.log("✓ Usuário demo garantido (CPF 12345678909 / senha: senha123)");
}

async function seedEvents() {
  const now = new Date();

  // IDs fixos para upsert idempotente
  const WELCOME_ID = "evt_welcome_seed";
  const DRAFT_ID = "evt_draft_seed";

  await prisma.event.upsert({
    where: { id: WELCOME_ID },
    update: {
      title: "Evento de Boas-Vindas",
      description: "Primeiro evento público da plataforma.",
      location: "Online",
      startsAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 dias
      endsAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // +2h
      isPublished: true,
    },
    create: {
      id: WELCOME_ID,
      title: "Evento de Boas-Vindas",
      description: "Primeiro evento público da plataforma.",
      location: "Online",
      startsAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      endsAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      isPublished: true,
    },
  });

  await prisma.event.upsert({
    where: { id: DRAFT_ID },
    update: {
      title: "Evento em Rascunho",
      description: "Ainda não publicado.",
      location: "A definir",
      startsAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // +14 dias
      isPublished: false,
    },
    create: {
      id: DRAFT_ID,
      title: "Evento em Rascunho",
      description: "Ainda não publicado.",
      location: "A definir",
      startsAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      isPublished: false,
    },
  });

  console.log("✓ Eventos seed garantidos (welcome/draft)");
}

async function main() {
  await seedUserDemo();
  await seedEvents();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // Se as tabelas não existirem, sugere aplicar migrações
    console.error("Falha no seed:", e);
    console.error("Dica: rode `pnpm prisma:deploy` para aplicar as migrações no Neon.");
    await prisma.$disconnect();
    process.exit(1);
  });

