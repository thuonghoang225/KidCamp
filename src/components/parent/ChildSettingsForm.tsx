"use client";

import { useActionState } from "react";
import { updateChildSettings } from "@/server/actions/parent";
import { Button } from "@/components/ui/Button";
import type { Child } from "@/server/repo/types";
import { VoicePicker } from "./VoicePicker";

export function ChildSettingsForm({ child }: { child: Child }) {
  const [state, action, pending] = useActionState(updateChildSettings, undefined);
  return (
    <form action={action} className="space-y-3">
      <h2 className="text-xl font-black">Thông tin của {child.nickname}</h2>
      <input type="hidden" name="childId" value={child.id} />
      <label className="block">
        <span className="font-bold">Tên gọi</span>
        <input name="nickname" defaultValue={child.nickname} maxLength={40} required className="mt-1 h-12 w-full rounded-2xl border-2 border-forest-100 px-4 font-bold outline-none focus:border-forest-500" />
      </label>
      <label className="block">
        <span className="font-bold">Mục tiêu mỗi ngày (phút)</span>
        <input name="dailyGoalMin" type="number" min={5} max={90} defaultValue={child.dailyGoalMin} className="mt-1 h-12 w-full rounded-2xl border-2 border-forest-100 px-4 font-bold outline-none focus:border-forest-500" />
      </label>
      <VoicePicker name="voice" defaultValue={child.voice} />
      {state?.error && <p className="font-bold text-ember-600">{state.error}</p>}
      {state && !state.error && <p className="font-bold text-forest-600">Đã lưu.</p>}
      <Button disabled={pending}>Lưu</Button>
    </form>
  );
}
