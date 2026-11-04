"use server";

import { isVoicePreference } from "@/subjects/english/speech/audio-key";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { parentCookieSecret } from "@/lib/env";
import { PARENT_COOKIE, PARENT_UNLOCK_MS, requireParent, requireParentUnlocked } from "@/server/auth/session";
import { sign } from "@/server/auth/signed-cookie";
import { repo } from "@/server/repo";
import type { FormState } from "./profile";

const Pin = z.string().regex(/^\d{4}$/, "Mã PIN gồm 4 chữ số");

/** Giới hạn nhập sai: 5 lần / 15 phút cho mỗi phụ huynh (trong bộ nhớ của server). */
const failures = new Map<string, { count: number; until: number }>();

async function setUnlocked(parentId: string) {
  (await cookies()).set(PARENT_COOKIE, sign(parentId, PARENT_UNLOCK_MS, parentCookieSecret), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: PARENT_UNLOCK_MS / 1000,
  });
}

export async function unlockParent(_: FormState, form: FormData): Promise<FormState> {
  const parsed = Pin.safeParse(form.get("pin"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const parent = await requireParent();

  const f = failures.get(parent.id);
  if (f && f.count >= 5 && f.until > Date.now()) return { error: "Nhập sai nhiều lần, thử lại sau 15 phút" };

  const hash = await repo.getPinHash(parent.id);
  if (!hash) {
    // Chưa có PIN: lần nhập này là đặt PIN mới
    await repo.setPin(parent.id, await bcrypt.hash(parsed.data, 10));
  } else if (!(await bcrypt.compare(parsed.data, hash))) {
    failures.set(parent.id, { count: (f?.count ?? 0) + 1, until: Date.now() + 15 * 60 * 1000 });
    return { error: "Mã PIN chưa đúng" };
  }
  failures.delete(parent.id);
  await setUnlocked(parent.id);
  redirect(String(form.get("next") || "/parent"));
}

export async function lockParent(): Promise<void> {
  (await cookies()).delete(PARENT_COOKIE);
  redirect("/home");
}

export async function changePin(_: FormState, form: FormData): Promise<FormState> {
  const parsed = Pin.safeParse(form.get("pin"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const parent = await requireParentUnlocked();
  await repo.setPin(parent.id, await bcrypt.hash(parsed.data, 10));
  return { error: undefined };
}

const Settings = z.object({
  childId: z.string().min(1),
  nickname: z.string().trim().min(1).max(40),
  dailyGoalMin: z.coerce.number().int().min(5).max(90),
  voice: z.string().refine(isVoicePreference, "Giọng đọc không hợp lệ").default("rotate"),
});

export async function updateChildSettings(_: FormState, form: FormData): Promise<FormState> {
  const parsed = Settings.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const parent = await requireParentUnlocked();
  await repo.updateChild(parent.id, parsed.data.childId, { nickname: parsed.data.nickname, dailyGoalMin: parsed.data.dailyGoalMin, voice: parsed.data.voice });
  revalidatePath("/parent", "layout");
  return {};
}

const MAX_AVATAR_BYTES = 600 * 1024;

/** Nhận ảnh khuôn mặt ĐÃ CẮT (WebP) từ trình duyệt. Ảnh gốc không bao giờ rời thiết bị. */
export async function uploadAvatar(childId: string, form: FormData): Promise<void> {
  const parent = await requireParentUnlocked();
  const file = form.get("face");
  if (!(file instanceof Blob)) throw new Error("Thiếu ảnh");
  if (file.size > MAX_AVATAR_BYTES) throw new Error("Ảnh quá lớn");
  if (file.type !== "image/webp" && file.type !== "image/png") throw new Error("Định dạng ảnh không hợp lệ");
  if (!(await repo.getChild(parent.id, childId))) throw new Error("Không tìm thấy hồ sơ");
  await repo.saveAvatar(parent.id, childId, new Uint8Array(await file.arrayBuffer()));
  revalidatePath("/", "layout");
}

export async function deleteAvatar(childId: string): Promise<void> {
  const parent = await requireParentUnlocked();
  await repo.deleteAvatar(parent.id, childId);
  revalidatePath("/", "layout");
}
