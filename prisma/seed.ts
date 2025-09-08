import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  const exists = await prisma.user.findUnique({ where: { cpf: "12345678909" } });
  if (!exists) {
    await prisma.user.create({
      data: {
        cpf: "12345678909",
        name: "Guilherme",
        email: "guilherme@example.com",
        phone: "(11) 99999-9999",
        passwordHash: await bcrypt.hash("senha123", 10),
        birthDate: new Date("1990-01-01")
      }
    });
  }
  console.log("Seed OK (user CPF 123.456.789-09 / senha: senha123)");
}
main().finally(()=>prisma.$disconnect());
