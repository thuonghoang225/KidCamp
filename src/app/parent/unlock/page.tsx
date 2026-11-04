import { requireParent } from "@/server/auth/session";
import { PinForm } from "./PinForm";

export const metadata = { title: "Góc phụ huynh" };

export default async function UnlockPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const parent = await requireParent();
  const { next } = await searchParams;
  const safeNext = next?.startsWith("/parent") ? next : "/parent";
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-forest-50 p-6">
      <h1 className="text-3xl font-black text-forest-700">Góc phụ huynh</h1>
      <p className="max-w-sm text-center text-muted">
        {parent.hasPin ? "Nhập mã PIN 4 số để tiếp tục." : "Đặt mã PIN 4 số. Bé sẽ không vào được khu này nếu không biết mã."}
      </p>
      <PinForm next={safeNext} setup={!parent.hasPin} />
    </main>
  );
}
