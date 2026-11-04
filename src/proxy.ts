import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC = ["/login", "/auth"];

/**
 * Làm mới phiên Supabase trên mọi request và chuyển người chưa đăng nhập về /login.
 * Đây chỉ là kiểm tra lạc quan; quyền thật được kiểm tra ở server (requireParent) và RLS.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next(); // chế độ Demo

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(toSet, headers) {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
        for (const [k, v] of Object.entries(headers ?? {})) response.headers.set(k, v);
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  const isPublic = PUBLIC.some((p) => request.nextUrl.pathname.startsWith(p));
  if (!data?.claims && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|img/|favicon.ico|icon.svg|apple-icon|manifest.webmanifest|.*\\.(?:png|svg|webp|jpg)$).*)"],
};
