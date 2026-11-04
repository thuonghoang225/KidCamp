import { unitLabel } from "@content/schema";
import { notFound } from "next/navigation";
import { StationId } from "@content/schema";
import { getUnit } from "@content/courses";
import { requireChild } from "@/server/auth/session";
import { getKidSummary } from "@/server/kid-summary";
import { Runner } from "@/components/exercises/Runner";

export default async function StationPage({ params }: { params: Promise<{ course: string; unitId: string; station: string }> }) {
  const { course, unitId, station } = await params;
  const unit = getUnit(course, unitId);
  const stationId = StationId.safeParse(station);
  if (!unit || unit.status !== "ready" || !stationId.success) notFound();
  const st = unit.stations.find((s) => s.id === stationId.data);
  if (!st) notFound();
  const { parent, child } = await requireChild();
  const { faceUrl } = await getKidSummary(parent, child);

  return (
    <Runner
      begin={{ kind: "station", courseId: course, unitId, stationId: stationId.data }}
      title={`${unitLabel(unit)} · ${st.title}`}
      backHref={`/${course}/units/${unitId}`}
      faceUrl={faceUrl}
      costumeId={child.costumeId} voice={child.voice}
    />
  );
}
