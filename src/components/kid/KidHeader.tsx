import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { faFire, faLock, faStar, faUserGroup } from "@/components/icons";
import { switchProfile } from "@/server/actions/profile";
import { KidCharacter } from "./KidCharacter";
import type { Child } from "@/server/repo";
import type { KidSummary } from "@/server/kid-summary";

export function KidHeader({ child, summary, profileCount }: { child: Child; summary: KidSummary; profileCount: number }) {
  const pct = Math.min(100, Math.round((summary.minutesToday / summary.goalMin) * 100));
  return (
    <header className="sticky top-0 z-10 border-b border-forest-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2">
        <Link href="/home" className="flex items-center gap-2" aria-label="Về trang chủ">
          <KidCharacter faceUrl={summary.faceUrl} costumeId={child.costumeId} className="h-14 w-11" />
          <span className="text-xl font-black text-forest-700">{child.nickname}</span>
        </Link>
        <div className="ml-auto flex items-center gap-2 text-lg font-extrabold">
          <span className="flex items-center gap-1 rounded-full bg-ember-100 px-3 py-1 text-ember-700" title="Chuỗi ngày học">
            <Icon icon={faFire} /> {summary.streak}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-sun-100 px-3 py-1 text-sun-700" title="Tổng số sao">
            <Icon icon={faStar} /> {summary.totalStars}
          </span>
          <span className="hidden items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700 sm:flex" title="Phút học hôm nay">
            <span className="h-2 w-16 overflow-hidden rounded-full bg-white">
              <span className="block h-full bg-sky-500" style={{ width: `${pct}%` }} />
            </span>
            {summary.minutesToday}/{summary.goalMin}′
          </span>
          {profileCount > 1 && (
            <form action={switchProfile}>
              <button className="flex items-center gap-1 rounded-full px-3 py-2 text-base text-forest-700 hover:bg-forest-50" title="Đổi người học">
                <Icon icon={faUserGroup} /> <span className="hidden sm:inline">Đổi bạn</span>
              </button>
            </form>
          )}
          <Link href="/parent" className="rounded-full p-2 text-muted hover:bg-forest-50" aria-label="Góc phụ huynh">
            <Icon icon={faLock} />
          </Link>
        </div>
      </div>
    </header>
  );
}
