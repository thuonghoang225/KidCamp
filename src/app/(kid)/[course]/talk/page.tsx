import Link from "next/link";
import { notFound } from "next/navigation";
import { dialogues, getCourse } from "@content/courses";
import { Icon } from "@/components/ui/Icon";
import { faArrowLeft, faBolt, faLock, faMasksTheater, faStopwatch, faWandMagicSparkles } from "@/components/icons";
import { FriendCharacter } from "@/components/kid/FriendCharacter";

export const metadata = { title: "Luyện phản xạ" };

export default async function TalkHub({ params }: { params: Promise<{ course: string }> }) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();
  const list = dialogues.filter((d) => d.courseId === course.id);

  return (
    <div className="space-y-6">
      <Link href={`/${course.id}`} className="inline-flex items-center gap-2 font-bold text-forest-700"><Icon icon={faArrowLeft} /> {course.titleVi}</Link>
      <div className="flex items-center gap-4">
        <FriendCharacter className="h-32 w-24" />
        <div>
          <h1 className="text-3xl font-black">Luyện phản xạ</h1>
          <p className="text-muted">Nghe câu hỏi và trả lời thật nhanh bằng tiếng Anh.</p>
        </div>
      </div>

      <Link href={`/${course.id}/talk/quick`} className="btn-candy flex items-center gap-4 rounded-3xl bg-ember-600 p-5 text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl"><Icon icon={faBolt} /></span>
        <span>
          <span className="block text-2xl font-black">Hỏi nhanh</span>
          <span className="block">8 câu từ các Unit con đã học, ưu tiên câu cần ôn · 3 phút</span>
        </span>
      </Link>

      <Link href={`/${course.id}/talk/speed`} className="btn-candy flex items-center gap-4 rounded-3xl bg-sun-400 p-5 text-ink">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/40 text-3xl"><Icon icon={faStopwatch} /></span>
        <span>
          <span className="block text-2xl font-black">Thử thách tốc độ</span>
          <span className="block">10 câu, trả lời đúng dưới 3 giây được tia chớp · phá kỷ lục của con</span>
        </span>
      </Link>

      <section>
        <h2 className="mb-3 text-xl font-black text-forest-700">Đóng vai theo tình huống</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((d) => (
            <li key={d.id} className="rounded-3xl bg-white p-4 ring-2 ring-forest-100">
              <p className="flex items-center gap-2 text-lg font-black"><Icon icon={faMasksTheater} className="text-sky-700" /> {d.titleVi}</p>
              <p className="mb-3 text-sm text-muted">{d.title} · với bạn {d.friend.name}</p>
              <div className="flex gap-2">
                {[1, 2, 3].map((r) => (
                  <Link key={r} href={`/${course.id}/talk/roleplay/${d.id}?round=${r}`} className="btn-candy rounded-xl bg-sky-100 px-3 py-2 font-extrabold text-sky-700">
                    Lượt {r}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-center gap-4 rounded-3xl bg-forest-50 p-5 opacity-70">
        <Icon icon={faWandMagicSparkles} className="text-3xl text-forest-600" />
        <div className="flex-1">
          <p className="text-lg font-black">Gọi cho bạn AI</p>
          <p className="text-sm text-muted">Mở khi con học xong 3 Unit.</p>
        </div>
        <Icon icon={faLock} className="text-muted" />
      </div>
    </div>
  );
}
