"use client";

import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { faMicrophone } from "@/components/icons";

export type MicState = "idle" | "opening" | "listening" | "hearing";

/**
 * Nút micro dùng chung (bài Nói và Luyện nói).
 * - opening: micro đang mở → vòng xoay mảnh quanh nút xanh, bé chưa nói.
 * - listening: micro đã thu, chưa có tiếng → nút đỏ, một vòng mờ nhẹ.
 * - hearing: máy đang nghe thấy bé nói → các vòng sóng lan mạnh ra ngoài.
 */
export function MicButton({ state, size = "lg", disabled, onClick }: { state: MicState; size?: "md" | "lg"; disabled?: boolean; onClick: () => void }) {
  const dim = size === "lg" ? "h-28 w-28 text-5xl" : "h-24 w-24 text-4xl";
  return (
    <span className={clsx("relative inline-flex", dim)}>
      {state === "listening" && (
        <span aria-hidden className="absolute -inset-1.5 rounded-full bg-ember-500/15 motion-safe:animate-pulse" />
      )}
      {state === "hearing" && (
        <>
          <span aria-hidden className="absolute inset-0 rounded-full bg-ember-500/45 motion-safe:animate-ping" />
          <span aria-hidden className="absolute -inset-3 rounded-full border-4 border-ember-500/40 motion-safe:animate-ping [animation-delay:300ms]" />
        </>
      )}
      {state === "opening" && (
        <span aria-hidden className="absolute -inset-2 rounded-full border-4 border-forest-100 border-t-forest-600 motion-safe:animate-spin" />
      )}
      <button
        type="button"
        disabled={disabled || state !== "idle"}
        onClick={onClick}
        aria-label={state === "idle" ? "Bấm để nói" : state === "opening" ? "Đang mở micro" : "Đang nghe"}
        className={clsx(
          "btn-candy relative flex items-center justify-center rounded-full text-white transition-colors duration-200 disabled:opacity-100",
          dim,
          state === "listening" || state === "hearing" ? "bg-ember-600" : "bg-forest-600",
        )}
      >
        <Icon icon={faMicrophone} />
      </button>
    </span>
  );
}
