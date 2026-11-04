"use client";

import { useActionState } from "react";
import { createChild } from "@/server/actions/profile";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faPlus } from "@/components/icons";

export function CreateChildForm({ bare = false }: { bare?: boolean }) {
  const [state, action, pending] = useActionState(createChild, undefined);
  return (
    <form action={action} className={bare ? "flex w-full flex-col gap-3" : "flex w-full max-w-sm flex-col gap-3 rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]"}>
      <label htmlFor="nickname" className="text-lg font-black">Tên gọi của bé</label>
      <input
        id="nickname"
        name="nickname"
        required
        maxLength={40}
        autoComplete="off"
        placeholder="Ví dụ: Bin"
        className="h-14 rounded-2xl border-2 border-forest-100 px-4 text-xl font-bold outline-none focus:border-forest-500"
      />
      {state?.error && <p className="font-bold text-ember-600">{state.error}</p>}
      <Button size="lg" disabled={pending}><Icon icon={faPlus} /> Tạo hồ sơ</Button>
    </form>
  );
}
