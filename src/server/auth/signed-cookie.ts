import { createHmac, timingSafeEqual } from "node:crypto";

/** Cookie có chữ ký HMAC: `<payload>.<hết hạn ms>.<chữ ký>`. */
export function sign(payload: string, ttlMs: number, secret: string, now = Date.now()): string {
  const exp = now + ttlMs;
  const sig = createHmac("sha256", secret).update(`${payload}.${exp}`).digest("base64url");
  return `${payload}.${exp}.${sig}`;
}

export function verify(value: string | undefined, expectedPayload: string, secret: string, now = Date.now()): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [payload, expStr, sig] = parts;
  if (payload !== expectedPayload) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < now) return false;
  const good = createHmac("sha256", secret).update(`${payload}.${exp}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(good);
  return a.length === b.length && timingSafeEqual(a, b);
}
