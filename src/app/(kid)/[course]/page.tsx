import { unitLabel } from "@content/schema";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clsx } from "clsx";
import { requireChild } from "@/server/auth/session";
import { getKidSummary } from "@/server/kid-summary";
import { getCourse } from "@content/courses";
import { Stars } from "@/components/kid/Stars";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { faComments, faLock, faRotateRight, faTrophy } from "@/components/icons";

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();
  const { parent, child } = await requireChild();
  const summary = await getKidSummary(parent, child);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">{course.titleVi}</h1>
          <p className="text-muted">{course.title}</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href={`/${course.id}/review`} tone="sky"><Icon icon={faRotateRight} /> Ôn hôm nay</ButtonLink>
          <ButtonLink href={`/${course.id}/talk`} tone="ember"><Icon icon={faComments} /> Luyện nói</ButtonLink>
        </div>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {course.units.map((u) => {
          const ready = u.status === "ready";
          const stars = u.stations.reduce((s, st) => s + (summary.stationStars.get(`${u.id}/${st.id}`) ?? 0), 0);
          const inner = (
            <div className={clsx("flex h-full items-center gap-4 rounded-3xl bg-white p-4 ring-2", ready ? "ring-forest-100 hover:ring-sun-300" : "ring-transparent opacity-55")}>
              <span className={clsx("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black", ready ? (u.kind === "review" ? "bg-sun-400 text-ink" : "bg-forest-600 text-white") : "bg-forest-100 text-forest-700")}>
                {u.kind === "review" ? <Icon icon={faTrophy} /> : u.number}
              </span>
              <span className="flex-1">
                <span className="block text-lg font-black leading-tight">{u.kind === "review" ? unitLabel(u) : u.title}</span>
                <span className="block text-sm text-muted">{u.titleVi}</span>
                {ready && <Stars value={Math.round(stars / Math.max(u.stations.length, 1))} size="text-sm" />}
              </span>
              {!ready && <Icon icon={faLock} className="text-muted" />}
            </div>
          );
          return <li key={u.id}>{ready ? <Link href={`/${course.id}/units/${u.id}`} className="block h-full">{inner}</Link> : inner}</li>;
        })}
      </ol>
    </div>
  );
}
