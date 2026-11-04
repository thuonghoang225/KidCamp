import { Logo } from "@/components/ui/Logo";
import { requireParent } from "@/server/auth/session";
import { repo } from "@/server/repo";
import { KidCharacter } from "@/components/kid/KidCharacter";
import { selectChild } from "@/server/actions/profile";
import { CreateChildForm } from "@/components/kid/CreateChildForm";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { faLock } from "@/components/icons";

export const metadata = { title: "Ai đang học?" };

export default async function ProfilesPage() {
  const parent = await requireParent();
  const children = await repo.listChildren(parent.id);
  const faces = await Promise.all(children.map((c) => (c.avatarPath ? repo.avatarUrl(c.avatarPath) : null)));

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-gradient-to-b from-sky-100 to-cream p-6">
      <div className="text-center">
        <h1><Logo size="xl" /></h1>
        <p className="mt-2 text-xl text-muted">{children.length ? "Ai đang học hôm nay?" : "Chào mừng! Tạo hồ sơ cho bé để bắt đầu."}</p>
      </div>

      {children.length > 0 ? (
        <ul className="flex flex-wrap justify-center gap-6">
          {children.map((c, i) => (
            <li key={c.id}>
              <form action={selectChild.bind(null, c.id)}>
                <button className="btn-candy flex w-44 flex-col items-center gap-2 rounded-3xl bg-white p-5 hover:ring-4 hover:ring-sun-300">
                  <KidCharacter faceUrl={faces[i]} costumeId={c.costumeId} pose="wave" className="h-40 w-32" />
                  <span className="text-2xl font-black">{c.nickname}</span>
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <CreateChildForm />
      )}

      <Link href="/parent" className="inline-flex items-center gap-2 font-bold text-muted hover:text-forest-700">
        <Icon icon={faLock} /> Góc phụ huynh
      </Link>
    </main>
  );
}
