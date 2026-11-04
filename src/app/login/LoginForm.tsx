"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const { error } = await createSupabaseBrowser().auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setState(error ? "error" : "sent");
  }

  async function google() {
    await createSupabaseBrowser().auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  }

  if (state === "sent") return <p className="rounded-3xl bg-white p-6 text-center text-lg font-bold">Đã gửi link đăng nhập tới {email}. Mở email trên máy này để vào KidCamp.</p>;

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
      <form onSubmit={sendLink} className="flex flex-col gap-3">
        <label htmlFor="email" className="font-black">Email của bố mẹ</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-2xl border-2 border-forest-100 px-4 text-lg outline-none focus:border-forest-500" />
        <Button size="lg" disabled={state === "sending"}>Gửi link đăng nhập</Button>
      </form>
      {state === "error" && <p className="font-bold text-ember-600">Không gửi được, thử lại nhé.</p>}
      <div className="my-1 text-center text-sm text-muted">hoặc</div>
      <Button tone="white" size="lg" onClick={google}>Đăng nhập bằng Google</Button>
    </div>
  );
}
