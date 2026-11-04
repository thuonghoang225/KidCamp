import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/env";
import { requireParent } from "@/server/auth/session";
import { readDemoAvatar } from "@/server/repo/demo";

/** Chỉ dùng ở chế độ Demo: trả ảnh khuôn mặt lưu trong .data/avatars. */
export async function GET(_: Request, ctx: { params: Promise<{ path: string[] }> }) {
  if (!isDemoMode) return new NextResponse(null, { status: 404 });
  const parent = await requireParent();
  const rel = decodeURIComponent((await ctx.params).path.join("/"));
  if (!rel.startsWith(`${parent.id}/`)) return new NextResponse(null, { status: 403 });
  const data = await readDemoAvatar(rel);
  if (!data) return new NextResponse(null, { status: 404 });
  return new NextResponse(new Uint8Array(data), { headers: { "content-type": "image/webp", "cache-control": "private, max-age=60" } });
}
