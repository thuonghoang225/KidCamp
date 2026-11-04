import { notFound } from "next/navigation";
import { getCourse } from "@content/courses";
import { requireChild } from "@/server/auth/session";
import { getKidSummary } from "@/server/kid-summary";
import { Talk } from "@/components/talk/Talk";

export const metadata = { title: "Hỏi nhanh" };

export default async function QuickPage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  if (!getCourse(course)) notFound();
  const { parent, child } = await requireChild();
  const { faceUrl } = await getKidSummary(parent, child);
  return <Talk begin={{ mode: "quick", courseId: course }} backHref={`/${course}/talk`} faceUrl={faceUrl} costumeId={child.costumeId} voice={child.voice} childName={child.nickname} />;
}
