import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

/** Supabase chuyển về đây sau khi bố mẹ bấm link đăng nhập / đăng nhập Google. */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/profiles", url.origin));
  }
  return NextResponse.redirect(new URL("/login?error=1", url.origin));
}
