// app/api/auth/forgot/request/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { generateResetToken, resetExpiry } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  const emailClean = String(email || "").trim().toLowerCase();

  if (!emailClean) return NextResponse.json({ ok: true }); // não expõe usuários

  const user = await prisma.user.findUnique({ where: { email: emailClean } });
  if (!user) return NextResponse.json({ ok: true }); // idem

  // Invalida tokens antigos
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  const token = generateResetToken();
  const expiresAt = resetExpiry(1);

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  });

  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = `${base}/auth/reset/${encodeURIComponent(token)}`;

  await sendMail({
    to: emailClean,
    subject: "Recuperar sua senha",
    html: `
      <p>Olá ${user.name ?? ""},</p>
      <p>Use o link abaixo para definir uma nova senha (expira em 1 hora):</p>
      <p><a href="${link}">${link}</a></p>
      <p>Se você não pediu, ignore este e-mail.</p>
    `,
    text: `Abra o link para redefinir sua senha: ${link}`,
  });

  return NextResponse.json({ ok: true });
}

