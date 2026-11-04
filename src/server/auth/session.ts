import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isDemoMode, parentCookieSecret } from "@/lib/env";
import { createSupabaseServer } from "@/lib/supabase/server";
import { repo, type Child, type Parent } from "@/server/repo";
import { verify } from "./signed-cookie";

export const CHILD_COOKIE = "kc_child";
export const PARENT_COOKIE = "kc_parent";
export const PARENT_UNLOCK_MS = 10 * 60 * 1000;
export const DEMO_PARENT_ID = "demo-parent";

/** Phụ huynh đang đăng nhập; chưa đăng nhập thì chuyển về /login. */
export const requireParent = cache(async (): Promise<Parent> => {
  await connection(); // luôn render theo request, không prerender lúc build
  if (isDemoMode) return repo.getParent(DEMO_PARENT_ID);
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  return repo.getParent(data.user.id);
});

/** Bé đang được chọn trên thiết bị này; chưa chọn thì về màn chọn hồ sơ. */
export const requireChild = cache(async (): Promise<{ parent: Parent; child: Child }> => {
  const parent = await requireParent();
  const childId = (await cookies()).get(CHILD_COOKIE)?.value;
  const child = childId ? await repo.getChild(parent.id, childId) : null;
  if (!child) redirect("/profiles");
  return { parent, child };
});

export async function isParentUnlocked(parentId: string): Promise<boolean> {
  return verify((await cookies()).get(PARENT_COOKIE)?.value, parentId, parentCookieSecret);
}

/** Góc phụ huynh: cần đã nhập PIN trong 10 phút gần nhất. */
export async function requireParentUnlocked(): Promise<Parent> {
  const parent = await requireParent();
  if (!parent.hasPin) redirect("/parent/unlock?setup=1");
  if (!(await isParentUnlocked(parent.id))) redirect("/parent/unlock");
  return parent;
}
