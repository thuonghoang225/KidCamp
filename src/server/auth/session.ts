import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isDemoMode, getParentCookieSecret } from "@/lib/env";
import { createSupabaseServer } from "@/lib/supabase/server";
import { repo, type Child, type Parent } from "@/server/repo";
import { verify } from "./signed-cookie";

export const CHILD_COOKIE = "kc_child";
export const PARENT_COOKIE = "kc_parent";
export const PARENT_UNLOCK_MS = 10 * 60 * 1000;
export const DEMO_PARENT_ID = "demo-parent";

/**
 * ID phụ huynh từ phiên đăng nhập. Dùng getClaims (kiểm tra chữ ký JWT ngay trên server,
 * khóa công khai được cache) thay vì getUser (gọi API Auth mỗi lần) để bớt một lượt mạng.
 */
const currentParentId = cache(async (): Promise<string> => {
  await connection(); // luôn render theo request, không prerender lúc build
  if (isDemoMode) return DEMO_PARENT_ID;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getClaims();
  const sub = data?.claims?.sub;
  if (!sub) redirect("/login");
  return sub;
});

/** Phụ huynh đang đăng nhập; chưa đăng nhập thì chuyển về /login. */
export const requireParent = cache(async (): Promise<Parent> => repo.getParent(await currentParentId()));

/** Bé đang được chọn trên thiết bị này; chưa chọn thì về màn chọn hồ sơ. */
export const requireChild = cache(async (): Promise<{ parent: Parent; child: Child }> => {
  const parentId = await currentParentId();
  const childId = (await cookies()).get(CHILD_COOKIE)?.value;
  // Hồ sơ phụ huynh và hồ sơ bé tải song song
  const [parent, child] = await Promise.all([requireParent(), childId ? repo.getChild(parentId, childId) : Promise.resolve(null)]);
  if (!child) redirect("/profiles");
  return { parent, child };
});

export async function isParentUnlocked(parentId: string): Promise<boolean> {
  return verify((await cookies()).get(PARENT_COOKIE)?.value, parentId, getParentCookieSecret());
}

/** Góc phụ huynh: cần đã nhập PIN trong 10 phút gần nhất. */
export async function requireParentUnlocked(): Promise<Parent> {
  const parent = await requireParent();
  if (!parent.hasPin) redirect("/parent/unlock?setup=1");
  if (!(await isParentUnlocked(parent.id))) redirect("/parent/unlock");
  return parent;
}
