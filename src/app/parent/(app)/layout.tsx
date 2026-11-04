import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { lockParent } from "@/server/actions/parent";
import { Icon } from "@/components/ui/Icon";
import { faChartLine, faHouse, faLock, faUserGroup } from "@/components/icons";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-forest-50">
      <header className="border-b border-forest-100 bg-white">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3 font-bold">
          <span className="mr-4 flex items-center gap-2"><Logo /><span className="text-xl font-black text-forest-700">· Góc phụ huynh</span></span>
          <Link href="/parent" className="rounded-xl px-3 py-2 hover:bg-forest-50"><Icon icon={faChartLine} /> Tiến độ</Link>
          <Link href="/parent/children" className="rounded-xl px-3 py-2 hover:bg-forest-50"><Icon icon={faUserGroup} /> Hồ sơ bé</Link>
          <form action={lockParent} className="ml-auto">
            <button className="rounded-xl px-3 py-2 text-muted hover:bg-forest-50"><Icon icon={faLock} /> Khóa</button>
          </form>
          <Link href="/home" className="rounded-xl px-3 py-2 text-muted hover:bg-forest-50"><Icon icon={faHouse} /> Về khu của bé</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
