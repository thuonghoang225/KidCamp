"use client";

import { useSyncExternalStore } from "react";
import { clsx } from "clsx";
import { speaker } from "@/subjects/english/speech/speaker";
import { Icon } from "@/components/ui/Icon";
import { faGaugeHigh, faGaugeSimple } from "@/components/icons";

/** Chọn tốc độ đọc: Bình thường / Chậm. Nhớ theo thiết bị. */
export function SpeedToggle() {
  const rate = useSyncExternalStore(speaker.subscribe, speaker.getRate, () => "normal" as const);
  const slow = rate === "slow";
  return (
    <div role="radiogroup" aria-label="Tốc độ đọc" className="flex shrink-0 rounded-full bg-forest-50 p-1 text-sm font-black">
      {(["normal", "slow"] as const).map((r) => (
        <button
          key={r}
          type="button"
          role="radio"
          aria-checked={rate === r}
          onClick={() => speaker.setRate(r)}
          className={clsx("flex h-10 items-center gap-1.5 rounded-full px-3", rate === r ? "bg-white text-forest-700 shadow" : "text-muted")}
        >
          <Icon icon={r === "normal" ? faGaugeHigh : faGaugeSimple} />
          <span className={clsx(r === "normal" && slow && "sr-only sm:not-sr-only")}>{r === "normal" ? "Bình thường" : "Chậm"}</span>
        </button>
      ))}
    </div>
  );
}
