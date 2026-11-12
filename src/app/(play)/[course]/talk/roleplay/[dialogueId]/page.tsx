import { notFound } from "next/navigation";
import { dialogues } from "@content/courses";
import { requireChild } from "@/server/auth/session";
import { getKidSummary } from "@/server/kid-summary";
import { Talk } from "@/components/talk/Talk";

export const metadata = { title: "Đóng vai" };

export default async function RoleplayPage({
  params, searchParams,
}: { params: Promise<{ course: string; dialogueId: string }>; searchParams: Promise<{ round?: string }> }) {
  const { course, dialogueId } = await params;
  const round = Math.min(3, Math.max(1, Number((await searchParams).round) || 1));
  if (!dialogues.some((d) => d.id === dialogueId)) notFound();
  const { parent, child } = await requireChild();
  const { faceUrl } = await getKidSummary(parent, child);
  return (
    <Talk
      begin={{ mode: "roleplay", dialogueId, round }}
      backHref={`/${course}/talk`}
      faceUrl={faceUrl}
      costumeId={child.costumeId} voice={child.voice}
      childName={child.nickname} childId={child.id}
    />
  );
}
