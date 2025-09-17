// app/api/register/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { registerSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { onlyDigits } from "@/lib/cpf";
import bcrypt from "bcryptjs"; // ⬅️ bcryptjs

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { name, cpf, phone, email, password } = parsed.data;
    const cpfClean = onlyDigits(cpf);
    const phoneClean = onlyDigits(phone);
    const emailClean = email.trim().toLowerCase();
    const nameClean = name.trim();

    const exists = await prisma.user.findFirst({
      where: { OR: [{ cpf: cpfClean }, { email: emailClean }] },
      select: { id: true },
    });
    if (exists) {
      return NextResponse.json(
        { error: "CPF ou e-mail já cadastrado" },
        { status: 409 }
      );
    }

    // ⬇️ hash com bcryptjs
    const passwordHash = bcrypt.hashSync(password, 10);

    await prisma.user.create({
      data: {
        cpf: cpfClean,
        name: nameClean,
        email: emailClean,
        phone: phoneClean,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Falha no servidor" }, { status: 500 });
  }
}

