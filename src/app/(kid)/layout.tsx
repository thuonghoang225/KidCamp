import { requireChild } from "@/server/auth/session";
import { getKidSummary } from "@/server/kid-summary";
import { KidHeader } from "@/components/kid/KidHeader";
import { repo } from "@/server/repo";

export default async function KidLayout({ children }: { children: React.ReactNode }) {
  const { parent, child } = await requireChild();
  const [summary, profiles] = await Promise.all([getKidSummary(parent, child), repo.listChildren(parent.id)]);
  return (
    <>
      <KidHeader child={child} summary={summary} profileCount={profiles.length} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
    </>
  );
}
