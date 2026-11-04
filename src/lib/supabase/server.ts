import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/** Supabase client chạy dưới danh nghĩa phụ huynh đang đăng nhập (RLS áp dụng). */
export async function createSupabaseServer() {
  const store = await cookies();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) store.set(name, value, options);
        } catch {
          // Gọi từ Server Component: không ghi được cookie, proxy.ts sẽ làm mới phiên
        }
      },
    },
  });
}
