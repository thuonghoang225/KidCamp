import { unitLabel } from "@content/schema";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { requireChild } from "@/server/auth/session";
import { getKidSummary } from "@/server/kid-summary";
import { nextStation } from "@/core/session/build";
import { getCourse, subjects } from "@content/courses";
import { KidCharacter } from "@/components/kid/KidCharacter";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { faBookOpen, faCalculator, faChevronRight, faComments, faLanguage, faLock, faRotateRight } from "@/components/icons";

export const metadata = { title: "Trại của bé" };

export default async function HomePage() {
  const { parent, child } = await requireChild();
  const summary = await getKidSummary(parent, child);
  const course = getCourse("en-g4")!;
  const next = nextStation(course.units, summary.completed);
  const nextTitle = next ? `${unitLabel(next.unit)} · ${next.unit.stations.find((s) => s.id === next.stationId)?.title}` : "Đã học hết bài hiện có";

  const steps = [
    { href: `/${course.id}/review`, icon: faRotateRight, title: "Ôn hôm nay", note: summary.dueCount ? `${Math.min(summary.dueCount, 8)} từ, mẫu câu cần ôn` : "Không có gì cần ôn", tone: "bg-sky-100 text-sky-700", done: summary.dueCount === 0 },
    { href: next ? `/${course.id}/units/${next.unit.id}/${next.stationId}` : `/${course.id}`, icon: faBookOpen, title: "Học mới", note: nextTitle, tone: "bg-forest-100 text-forest-700", done: !next },
    { href: `/${course.id}/talk`, icon: faComments, title: "Luyện phản xạ", note: "Hỏi nhanh và đóng vai · 10 phút", tone: "bg-ember-100 text-ember-700", done: false },
  ];

  return (
    <div className="space-y-8">
      <section className="flex items-center gap-4">
        <KidCharacter faceUrl={summary.faceUrl} costumeId={child.costumeId} pose="wave" className="h-36 w-28 shrink-0" />
        <div>
          <p className="text-3xl font-black">Chào {child.nickname}!</p>
          <p className="text-lg text-muted">Hôm nay mình học {summary.goalMin} phút nhé. Con đã học {summary.minutesToday} phút.</p>
        </div>
      </section>

      <section aria-labelledby="today">
        <h2 id="today" className="mb-3 text-xl font-black text-forest-700">Buổi học hôm nay</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Link href={s.href} className="btn-candy flex h-full items-center gap-4 rounded-3xl bg-white p-4 ring-2 ring-forest-100 hover:ring-sun-300">
                <span className={clsx("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl", s.tone)}>
                  <Icon icon={s.icon} />
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-black">{i + 1}. {s.title}</span>
                  <span className="block text-sm text-muted">{s.note}</span>
                </span>
                <Icon icon={faChevronRight} className="text-forest-200" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="subjects">
        <h2 id="subjects" className="mb-3 text-xl font-black text-forest-700">Chọn khu học</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((s) => {
            const ready = s.status === "ready";
            const card = (
              <Card className={clsx("flex items-center gap-4", ready ? "hover:ring-4 hover:ring-sun-300" : "opacity-60")}>
                <span className={clsx("flex h-20 w-20 items-center justify-center rounded-3xl text-4xl", ready ? "bg-forest-600 text-white" : "bg-forest-100 text-forest-600")}>
                  <Icon icon={s.icon === "language" ? faLanguage : faCalculator} />
                </span>
                <span>
                  <span className="block text-2xl font-black">{s.name}</span>
                  <span className="block text-muted">{ready ? "Lớp 4 · Global Success" : "Sắp mở"}</span>
                </span>
                {!ready && <Icon icon={faLock} className="ml-auto text-xl text-muted" />}
                {ready && <Image src="/img/emoji/camping.png" alt="" width={56} height={56} className="ml-auto" />}
              </Card>
            );
            return ready ? <Link key={s.id} href={`/${s.courses[0]}`}>{card}</Link> : <div key={s.id} aria-disabled>{card}</div>;
          })}
        </div>
      </section>
    </div>
  );
}
