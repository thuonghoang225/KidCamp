import { requireParentUnlocked } from "@/server/auth/session";
import { repo } from "@/server/repo";
import { today } from "@/server/today";
import { addDays } from "@/core/date";
import { computeStreak } from "@/core/rewards";
import { courses, findPattern } from "@content/courses";
import { lexicon } from "@content/english/lexicon";
import { getUnit } from "@content/courses";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { SpeakButton } from "@/components/exercises/SpeakButton";
import { KidCharacter } from "@/components/kid/KidCharacter";
import { Icon } from "@/components/ui/Icon";
import { faClock, faComments, faFire, faLightbulb, faStar } from "@/components/icons";

export const metadata = { title: "Tiến độ" };

const WEEKDAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function itemLabel(itemId: string): string {
  return lexicon.get(itemId)?.text ?? findPattern(itemId)?.pattern.question ?? itemId;
}

export default async function ParentDashboard() {
  const parent = await requireParentUnlocked();
  const children = await repo.listChildren(parent.id);
  const day = today(parent.timezone);

  if (children.length === 0) {
    return (
      <main className="mx-auto w-full max-w-5xl p-6">
        <Card className="text-center">
          <p className="mb-4 text-xl font-black">Chưa có hồ sơ bé nào.</p>
          <ButtonLink href="/profiles">Tạo hồ sơ</ButtonLink>
        </Card>
      </main>
    );
  }

  const data = await Promise.all(
    children.map(async (c) => {
      const [activity, weak, talk, face, stations] = await Promise.all([
        repo.getActivity(c.id, addDays(day, -90)),
        repo.weakItems(c.id, 5),
        repo.talkStats(c.id, addDays(day, -7)),
        c.avatarPath ? repo.avatarUrl(c.avatarPath) : null,
        Promise.all([...courses.keys()].map((id) => repo.getStations(c.id, id))).then((x) => x.flat()),
      ]);
      return { c, activity, weak, talk, face, stations };
    }),
  );

  const dinnerQuestion = getUnit("en-g4", "u01")!.patterns[0];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      {data.map(({ c, activity, weak, talk, face, stations }) => {
        const week = Array.from({ length: 7 }, (_, i) => addDays(day, i - 6));
        const minutes = week.map((d) => Math.round((activity.find((a) => a.day === d)?.seconds ?? 0) / 60));
        const max = Math.max(c.dailyGoalMin, ...minutes);
        const streak = computeStreak(activity.filter((a) => a.sessionsCount > 0).map((a) => a.day), day);
        const spokenToday = activity.find((a) => a.day === day)?.spokenCount ?? 0;
        return (
          <section key={c.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <KidCharacter faceUrl={face} costumeId={c.costumeId} className="h-16 w-12" />
              <h1 className="text-2xl font-black">{c.nickname}</h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon={faClock} label="Hôm nay" value={`${minutes[6]}/${c.dailyGoalMin} phút`} />
              <Stat icon={faFire} label="Chuỗi ngày học" value={`${streak} ngày`} />
              <Stat icon={faComments} label="Câu tự nói hôm nay" value={String(spokenToday)} />
              <Stat icon={faStar} label="Trạm đã xong" value={String(stations.length)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <h2 className="mb-1 font-black">Phút học 7 ngày qua</h2>
                <p className="mb-4 text-sm text-muted">Vạch ngang là mục tiêu {c.dailyGoalMin} phút/ngày.</p>
                <div className="relative flex h-40 items-end gap-3">
                  <div className="absolute inset-x-0 border-t-2 border-dashed border-sun-400" style={{ bottom: `${(c.dailyGoalMin / max) * 100}%` }} />
                  {week.map((d, i) => (
                    <div key={d} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-xs font-bold text-muted">{minutes[i] || ""}</span>
                      <div className="w-full rounded-t-lg bg-forest-500" style={{ height: `${(minutes[i] / max) * 120}px` }} />
                      <span className="text-xs font-bold text-muted">{WEEKDAY[new Date(`${d}T00:00:00Z`).getUTCDay()]}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="mb-3 font-black">Phản xạ nói (7 ngày)</h2>
                <dl className="grid grid-cols-3 gap-3 text-center">
                  <div><dt className="text-sm text-muted">Câu đã nói</dt><dd className="text-2xl font-black">{talk.childTurns}</dd></div>
                  <div><dt className="text-sm text-muted">Thời gian phản xạ</dt><dd className="text-2xl font-black">{talk.avgLatencyMs !== null ? `${(talk.avgLatencyMs / 1000).toFixed(1)}s` : "–"}</dd></div>
                  <div><dt className="text-sm text-muted">Không cần gợi ý</dt><dd className="text-2xl font-black">{talk.unaidedRatio !== null ? `${Math.round(talk.unaidedRatio * 100)}%` : "–"}</dd></div>
                </dl>
                <p className="mt-3 text-sm text-muted">Ba con số này nên tăng dần (thời gian phản xạ giảm dần) theo tuần.</p>
              </Card>

              <Card>
                <h2 className="mb-3 font-black">Từ và mẫu câu bé hay sai</h2>
                {weak.length === 0 ? (
                  <p className="text-muted">Chưa có. Bé học thêm vài buổi để có số liệu.</p>
                ) : (
                  <ul className="space-y-2">
                    {weak.map((w) => (
                      <li key={w.itemId} className="flex items-center gap-3">
                        <SpeakButton text={itemLabel(w.itemId)} size="sm" />
                        <span className="flex-1 font-bold">{itemLabel(w.itemId)}</span>
                        <span className="text-sm text-muted">sai {w.wrong}/{w.total}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card className="bg-sun-100">
                <h2 className="mb-2 flex items-center gap-2 font-black"><Icon icon={faLightbulb} /> Hỏi bé trong bữa cơm</h2>
                <p className="text-2xl font-black">{dinnerQuestion.question}</p>
                <p className="text-muted">{dinnerQuestion.meaning}</p>
                <div className="mt-2"><SpeakButton text={dinnerQuestion.question} size="sm" /></div>
              </Card>
            </div>
          </section>
        );
      })}
    </main>
  );
}

function Stat({ icon, label, value }: { icon: Parameters<typeof Icon>[0]["icon"]; label: string; value: string }) {
  return (
    <Card className="flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-100 text-xl text-forest-700"><Icon icon={icon} /></span>
      <span>
        <span className="block text-sm text-muted">{label}</span>
        <span className="block text-xl font-black">{value}</span>
      </span>
    </Card>
  );
}
