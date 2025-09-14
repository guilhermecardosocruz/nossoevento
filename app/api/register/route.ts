export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { onlyDigits } from "@/lib/cpf";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { name, cpf, phone, email, password } = parsed.data; = parsed.data;
  const cpfClean = onlyDigits(cpf);

  const exists = await prisma.user.findFirst({ where: { OR: [{ cpf: cpfClean }, { email }] } } );
  if (exists) return NextResponse.json({ error: "CPF ou e-mail já cadastrado" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      cpf: cpfClean,
      name,
      passwordHash,
      email,
      phone,
     
    }
  });

  return NextResponse.json({ ok: true });
}
