import { Logo, LogoMark } from "@/components/ui/Logo";
import Link from "next/link";
import { lockParent } from "@/server/actions/parent";
import { Icon } from "@/components/ui/Icon";
import { faChartLine, faHouse, faLock, faUserGroup } from "@/components/icons";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-forest-50">
      <header className="border-b border-forest-100 bg-white">
        {/* Màn hẹp: hàng 1 = logo + Khóa/Về khu của bé, hàng 2 = các mục. Màn rộng (lg): một hàng. */}
        <nav className="mx-auto grid max-w-5xl grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 whitespace-nowrap px-4 py-2 font-bold lg:flex lg:py-3">
          <span className="flex min-w-0 items-center gap-2 lg:mr-4">
            <span className="sm:hidden"><LogoMark className="size-9" /></span>
            <span className="hidden sm:inline-flex"><Logo /></span>
            <span className="truncate text-lg font-black text-forest-700 sm:text-xl"><span className="hidden sm:inline">· </span>Góc phụ huynh</span>
          </span>
          <div className="col-span-2 row-start-2 flex gap-1 lg:contents">
            <Link href="/parent" className="rounded-xl px-3 py-2 hover:bg-forest-50"><Icon icon={faChartLine} /> Tiến độ</Link>
            <Link href="/parent/children" className="rounded-xl px-3 py-2 hover:bg-forest-50"><Icon icon={faUserGroup} /> Hồ sơ bé</Link>
          </div>
          <div className="col-start-2 row-start-1 flex items-center lg:ml-auto">
            <form action={lockParent}>
              <button className="rounded-xl px-3 py-2 text-muted hover:bg-forest-50" aria-label="Khóa góc phụ huynh">
                <Icon icon={faLock} /> <span className="hidden sm:inline">Khóa</span>
              </button>
            </form>
            <Link href="/home" className="rounded-xl px-3 py-2 text-muted hover:bg-forest-50" aria-label="Về khu của bé">
              <Icon icon={faHouse} /> <span className="hidden sm:inline">Về khu của bé</span>
            </Link>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
