"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

type Mode = "signin" | "signup";

/**
 * Bố mẹ đăng ký / đăng nhập bằng email + mật khẩu (không gửi email link).
 * Cần tắt "Confirm email" trong Supabase để đăng ký xong là vào được ngay.
 */
export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (mode === "signup" && password !== confirm) return setError("Hai mật khẩu chưa giống nhau.");
    setBusy(true);
    const supabase = createSupabaseBrowser();
    const { data, error: err } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (err) {
      console.error(`[KidCamp] ${mode}`, err);
      return setError(explain(err.message, err.status, mode));
    }
    if (!data.session) {
      // Supabase còn bật "Confirm email": tài khoản đã tạo nhưng chưa đăng nhập được
      return setNotice("Đã tạo tài khoản nhưng Supabase đang yêu cầu xác nhận email. Tắt \"Confirm email\" trong Supabase (Authentication → Sign In / Providers → Email) rồi đăng nhập lại.");
    }
    // refresh để server component đọc phiên đăng nhập mới trong cookie
    router.replace("/profiles");
    router.refresh();
  }

  async function google() {
    await createSupabaseBrowser().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
  }

  const input = "h-12 rounded-2xl border-2 border-forest-100 px-4 text-lg outline-none focus:border-forest-500";

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
      <div role="tablist" aria-label="Đăng nhập hoặc tạo tài khoản" className="grid grid-cols-2 rounded-2xl bg-forest-50 p-1 font-black">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={clsx("h-11 rounded-xl", mode === m ? "bg-white text-forest-700 shadow" : "text-muted")}
          >
            {m === "signin" ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="font-black">Email của bố mẹ</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-black">Mật khẩu</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
          />
        </label>
        {mode === "signup" && (
          <label className="flex flex-col gap-1">
            <span className="font-black">Nhập lại mật khẩu</span>
            <input type="password" required minLength={6} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} />
            <span className="text-sm text-muted">Ít nhất 6 ký tự.</span>
          </label>
        )}
        <Button size="lg" disabled={busy}>
          {busy ? "Đang xử lý…" : mode === "signin" ? "Đăng nhập" : "Tạo tài khoản"}
        </Button>
      </form>

      {error && <p className="font-bold text-ember-600" role="alert">{error}</p>}
      {notice && <p className="font-bold text-sky-700" role="status">{notice}</p>}

      <div className="text-center text-sm text-muted">hoặc</div>
      <Button tone="white" size="lg" onClick={google}>Đăng nhập bằng Google</Button>
    </div>
  );
}

/** Đổi lỗi của Supabase Auth sang lời dễ hiểu cho bố mẹ. */
function explain(message: string, status: number | undefined, mode: Mode): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email hoặc mật khẩu chưa đúng.";
  if (m.includes("email not confirmed")) return "Tài khoản chưa xác nhận email. Tắt \"Confirm email\" trong Supabase rồi thử lại.";
  if (m.includes("already registered") || m.includes("already exists")) return "Email này đã có tài khoản. Chuyển sang Đăng nhập nhé.";
  if (m.includes("password")) return "Mật khẩu chưa đủ mạnh (ít nhất 6 ký tự).";
  if (m.includes("signups not allowed") || m.includes("signup is disabled")) return "Supabase đang tắt đăng ký mới (Authentication → Sign In / Providers → Allow new users to sign up).";
  if (status === 429 || m.includes("rate limit")) return "Thử quá nhiều lần, đợi một lát rồi thử lại.";
  if (m.includes("fetch") || m.includes("network")) return "Không kết nối được tới Supabase.";
  return `${mode === "signin" ? "Không đăng nhập được" : "Không tạo được tài khoản"}: ${message}`;
}
