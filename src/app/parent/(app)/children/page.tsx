import { requireParentUnlocked } from "@/server/auth/session";
import { repo } from "@/server/repo";
import { Card } from "@/components/ui/Card";
import { ChildSettingsForm } from "@/components/parent/ChildSettingsForm";
import { AvatarEditor } from "@/components/parent/AvatarEditor";
import { ChangePinForm } from "@/components/parent/ChangePinForm";
import { CreateChildForm } from "@/components/kid/CreateChildForm";

export const metadata = { title: "Hồ sơ bé" };

export default async function ChildrenPage() {
  const parent = await requireParentUnlocked();
  const children = await repo.listChildren(parent.id);
  const faces = await Promise.all(children.map((c) => (c.avatarPath ? repo.avatarUrl(c.avatarPath) : null)));

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      {children.map((c, i) => (
        <Card key={c.id} className="grid gap-6 md:grid-cols-2">
          <ChildSettingsForm child={c} />
          <AvatarEditor childId={c.id} costumeId={c.costumeId} currentFace={faces[i]} />
        </Card>
      ))}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-xl font-black">Thêm hồ sơ bé</h2>
          <CreateChildForm bare />
        </Card>
        <Card>
          <h2 className="mb-3 text-xl font-black">Đổi mã PIN</h2>
          <ChangePinForm />
        </Card>
      </div>
    </main>
  );
}
