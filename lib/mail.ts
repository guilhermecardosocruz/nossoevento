// lib/mail.ts
const RESEND_API = "https://api.resend.com/emails";

type SendOpts = { to: string; subject: string; html: string; text?: string };

export async function sendMail({ to, subject, html, text }: SendOpts) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESET_FROM_EMAIL || "no-reply@yourapp.dev";

  if (!key) {
    // Sem provedor configurado? Loga o conteúdo (dev)
    console.log("[DEV mail]", { to, subject, html });
    return { ok: true };
  }

  const r = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Resend error: ${r.status} ${err}`);
  }
  return await r.json();
}

