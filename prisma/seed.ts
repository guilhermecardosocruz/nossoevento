import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // exemplos de seeds idempotentes
  await prisma.role?.upsert?.({
    where: { name: 'ADMIN' as any },
    update: {},
    create: { name: 'ADMIN' as any }
  } as any).catch(() => void 0);

  // adicione aqui seus upserts (não falha se tabela não existir)
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
