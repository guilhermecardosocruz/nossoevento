// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const onlyDigits = (s: string) => s.replace(/\D/g, "");

async function seedUserDemo() {
  const cpf = onlyDigits("123.456.789-09"); // CPF de exemplo (válido)
  const passwordHash = bcrypt.hashSync("senha123", 10);

  await prisma.user.upsert({
    where: { cpf }, // cpf é único
    update: { passwordHash }, // garante senha conhecida no re-run
    create: {
      cpf,
      name: "Usuário Demo",
      email: "demo@nossoevento.dev",
      phone: "11999999999",
      passwordHash,
    },
  });

  console.log("✓ Usuário demo garantido (CPF 12345678909 / senha: senha123)");
}

async function seedEvents() {
  const now = Date.now();
  const in7d = new Date(now + 7 * 24 * 60 * 60 * 1000);
  const in30d = new Date(now + 30 * 24 * 60 * 60 * 1000);

  // Evento publicado (exemplo)
  await prisma.event.upsert({
    where: { id: "evt_welcome_seed" },
    update: {
      title: "Bem-vindo ao Nosso Evento",
      description: "Primeiro evento de demonstração.",
      location: "Online",
      startsAt: in7d,
      endsAt: new Date(in7d.getTime() + 2 * 60 * 60 * 1000),
      isPublished: true,
    },
    create: {
      id: "evt_welcome_seed",
      title: "Bem-vindo ao Nosso Evento",
      description: "Primeiro evento de demonstração.",
      location: "Online",
      startsAt: in7d,
      endsAt: new Date(in7d.getTime() + 2 * 60 * 60 * 1000),
      isPublished: true,
    },
  });

  // Evento rascunho (exemplo)
  await prisma.event.upsert({
    where: { id: "evt_draft_seed" },
    update: {
      title: "Rascunho de Evento",
      description: "Este evento está como rascunho.",
      location: "A definir",
      startsAt: in30d,
      endsAt: null,
      isPublished: false,
    },
    create: {
      id: "evt_draft_seed",
      title: "Rascunho de Evento",
      description: "Este evento está como rascunho.",
      location: "A definir",
      startsAt: in30d,
      endsAt: null,
      isPublished: false,
    },
  });

  console.log("✓ Eventos seed garantidos");
}

async function main() {
  await seedUserDemo();

  try {
    await seedEvents();
  } catch (e: any) {
    // Se a tabela Event ainda não existir, avisa de forma amigável
    if (e?.code === "P2021") {
      console.warn("Tabela 'Event' não encontrada — rode `pnpm prisma:deploy` e depois `pnpm seed`.");
    } else {
      throw e;
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Falha no seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

