"use client";

import { useActionState, useState } from "react";
import { unlockParent } from "@/server/actions/parent";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faLockOpen, faXmark } from "@/components/icons";

export function PinForm({ next, setup }: { next: string; setup: boolean }) {
  const [state, action, pending] = useActionState(unlockParent, undefined);
  const [pin, setPin] = useState("");
  const press = (d: string) => setPin((p) => (p.length < 4 ? p + d : p));

  return (
    <form action={action} className="flex flex-col items-center gap-4">
      <input type="hidden" name="pin" value={pin} />
      <input type="hidden" name="next" value={next} />
      <div className="flex gap-3" aria-label="Mã PIN">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex h-14 w-12 items-center justify-center rounded-2xl bg-white text-3xl font-black ring-2 ring-forest-100">
            {pin[i] ? "•" : ""}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <Button key={d} type="button" tone="white" size="lg" className="w-20" onClick={() => press(d)}>{d}</Button>
        ))}
        <Button type="button" tone="white" size="lg" className="w-20" onClick={() => setPin((p) => p.slice(0, -1))} aria-label="Xóa"><Icon icon={faXmark} /></Button>
        <Button type="button" tone="white" size="lg" className="w-20" onClick={() => press("0")}>0</Button>
        <Button size="lg" className="w-20" disabled={pin.length !== 4 || pending} aria-label={setup ? "Đặt mã" : "Mở khóa"}><Icon icon={faLockOpen} /></Button>
      </div>
      {state?.error && <p className="font-bold text-ember-600">{state.error}</p>}
    </form>
  );
}
