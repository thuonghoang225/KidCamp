import { unitLabel } from "@content/schema";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clsx } from "clsx";
import { requireChild } from "@/server/auth/session";
import { getKidSummary } from "@/server/kid-summary";
import { getUnit } from "@content/courses";
import { Stars } from "@/components/kid/Stars";
import { Icon } from "@/components/ui/Icon";
import { faArrowLeft, faBookOpen, faComment, faMusic, faEarListen, faTrophy } from "@/components/icons";

const stationIcon = { words: faBookOpen, patterns: faComment, chant: faMusic, sounds: faEarListen, challenge: faTrophy } as const;
const stationTone = {
  words: "bg-forest-600", patterns: "bg-sky-600", chant: "bg-sun-400", sounds: "bg-ember-600", challenge: "bg-forest-700",
} as const;

export default async function UnitPage({ params }: { params: Promise<{ course: string; unitId: string }> }) {
  const { course, unitId } = await params;
  const unit = getUnit(course, unitId);
  if (!unit || unit.status !== "ready") notFound();
  const { parent, child } = await requireChild();
  const summary = await getKidSummary(parent, child);

  return (
    <div className="space-y-6">
      <Link href={`/${course}`} className="inline-flex items-center gap-2 font-bold text-forest-700">
        <Icon icon={faArrowLeft} /> Tất cả Unit
      </Link>
      <div>
        <p className="font-bold text-muted">{unitLabel(unit)}</p>
        <h1 className="text-4xl font-black">{unit.title}</h1>
        <p className="text-lg text-muted">{unit.titleVi}</p>
      </div>

      {/* Bản đồ trạm: con đường zig-zag */}
      <ol className="relative mx-auto flex max-w-md flex-col gap-6 py-4">
        {unit.stations.map((st, i) => {
          const stars = summary.stationStars.get(`${unit.id}/${st.id}`) ?? 0;
          return (
            <li key={st.id} className={clsx("flex", i % 2 ? "justify-end" : "justify-start")}>
              <Link href={`/${course}/units/${unit.id}/${st.id}`} className="group flex items-center gap-4">
                <span className={clsx("btn-candy flex h-24 w-24 items-center justify-center rounded-full text-4xl text-white group-hover:scale-105 transition-transform", stationTone[st.id], stars > 0 && "ring-8 ring-sun-300")}>
                  <Icon icon={stationIcon[st.id]} />
                </span>
                <span>
                  <span className="block text-xl font-black">{st.title}</span>
                  <span className="block text-sm text-muted">{st.subtitle}</span>
                  <Stars value={stars} size="text-base" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
