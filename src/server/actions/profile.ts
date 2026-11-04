"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CHILD_COOKIE, isParentUnlocked, requireParent } from "@/server/auth/session";
import { repo } from "@/server/repo";

export async function selectChild(childId: string): Promise<void> {
  z.string().min(1).parse(childId);
  const parent = await requireParent();
  const child = await repo.getChild(parent.id, childId);
  if (!child) throw new Error("Không tìm thấy hồ sơ");
  (await cookies()).set(CHILD_COOKIE, child.id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
  redirect("/home");
}

const Create = z.object({ nickname: z.string().trim().min(1, "Nhập tên của bé").max(40) });

export type FormState = { error?: string } | undefined;

/** Tạo hồ sơ bé: lần đầu ai cũng tạo được; từ hồ sơ thứ hai cần mở khóa phụ huynh. */
export async function createChild(_: FormState, form: FormData): Promise<FormState> {
  const parsed = Create.safeParse({ nickname: form.get("nickname") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const parent = await requireParent();
  const existing = await repo.listChildren(parent.id);
  if (existing.length > 0 && !(await isParentUnlocked(parent.id))) return { error: "Cần mở khóa phụ huynh để thêm hồ sơ" };
  const child = await repo.createChild(parent.id, parsed.data.nickname);
  if (existing.length === 0) await selectChild(child.id);
  redirect(existing.length === 0 ? "/home" : "/parent/children");
}

export async function switchProfile(): Promise<void> {
  (await cookies()).delete(CHILD_COOKIE);
  redirect("/profiles");
}
