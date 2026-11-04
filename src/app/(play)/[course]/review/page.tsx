import { notFound } from "next/navigation";
import { getCourse } from "@content/courses";
import { requireChild } from "@/server/auth/session";
import { getKidSummary } from "@/server/kid-summary";
import { Runner } from "@/components/exercises/Runner";

export const metadata = { title: "Ôn hôm nay" };

export default async function ReviewPage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  if (!getCourse(course)) notFound();
  const { parent, child } = await requireChild();
  const { faceUrl } = await getKidSummary(parent, child);
  return <Runner begin={{ kind: "review", courseId: course }} title="Ôn hôm nay" backHref="/home" faceUrl={faceUrl} costumeId={child.costumeId} voice={child.voice} />;
}
