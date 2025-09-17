// app/api/auth/forgot/reset/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = (await req.json().catch(() => ({}))) as {
    token?: string;
    password?: string;
  };

  if (!token || !password || password.length < 6) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const row = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!row || row.usedAt || row.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token inválido/expirado" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: row.userId }, data: { passwordHash: hash } }),
    prisma.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

