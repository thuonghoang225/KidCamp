import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10).optional(),
  PARENT_COOKIE_SECRET: z.string().min(16).optional(),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
  PARENT_COOKIE_SECRET: process.env.PARENT_COOKIE_SECRET || undefined,
});

if (!parsed.success) {
  throw new Error(`Biến môi trường không hợp lệ: ${parsed.error.message}`);
}

export const env = parsed.data;

/** Chưa cấu hình Supabase thì chạy chế độ Demo (dữ liệu lưu trong .data/). */
export const isDemoMode = !env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Khóa ký cookie mở khóa khu phụ huynh. Kiểm tra lúc dùng (không phải lúc import),
 * để `next build` không hỏng khi môi trường build chưa có biến này.
 */
export function getParentCookieSecret(): string {
  if (env.PARENT_COOKIE_SECRET) return env.PARENT_COOKIE_SECRET;
  if (!isDemoMode && process.env.NODE_ENV === "production") {
    throw new Error("Cần đặt PARENT_COOKIE_SECRET (ít nhất 16 ký tự) khi chạy production với Supabase");
  }
  return "kidcamp-demo-secret-change-me";
}
