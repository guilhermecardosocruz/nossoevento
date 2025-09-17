// lib/tokens.ts
import crypto from "crypto";

export function generateResetToken() {
  // 32 bytes → 43 chars base64url
  return crypto.randomBytes(32).toString("base64url");
}

export function resetExpiry(hours = 1) {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d;
}

