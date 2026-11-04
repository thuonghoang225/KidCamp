import { Logo } from "@/components/ui/Logo";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/env";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Đăng nhập" };

export default function LoginPage() {
  if (isDemoMode) redirect("/profiles");
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-100 to-cream p-6">
      <h1><Logo size="xl" /></h1>
      <p className="max-w-sm text-center text-muted">Bố mẹ đăng nhập một lần trên máy của bé. Bé không cần tài khoản riêng.</p>
      <LoginForm />
    </main>
  );
}
