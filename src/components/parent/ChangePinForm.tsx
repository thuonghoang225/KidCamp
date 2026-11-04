"use client";

import { useActionState } from "react";
import { changePin } from "@/server/actions/parent";
import { Button } from "@/components/ui/Button";

export function ChangePinForm() {
  const [state, action, pending] = useActionState(changePin, undefined);
  return (
    <form action={action} className="flex flex-col gap-3">
      <input name="pin" inputMode="numeric" pattern="\d{4}" maxLength={4} required placeholder="4 chữ số mới" className="h-12 rounded-2xl border-2 border-forest-100 px-4 text-xl font-bold tracking-[0.5em] placeholder:tracking-normal placeholder:text-base outline-none focus:border-forest-500" />
      {state?.error && <p className="font-bold text-ember-600">{state.error}</p>}
      {state && !state.error && <p className="font-bold text-forest-600">Đã đổi mã PIN.</p>}
      <Button disabled={pending}>Đổi mã</Button>
    </form>
  );
}
