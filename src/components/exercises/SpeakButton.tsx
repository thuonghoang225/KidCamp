"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { speaker } from "@/subjects/english/speech/speaker";
import { Icon } from "@/components/ui/Icon";
import { faVolumeHigh } from "@/components/icons";

export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => speaker.stop(), []);
  return {
    speaking,
    async speak(text: string, rate?: number, fallback?: string) {
      setSpeaking(true);
      await speaker.play(text, { rate, fallback });
      setSpeaking(false);
    },
  };
}

export function SpeakButton({
  text, fallback, autoPlay = false, size = "md", label, className, rate,
}: { text: string; fallback?: string; autoPlay?: boolean; size?: "sm" | "md" | "lg"; label?: string; className?: string; rate?: number }) {
  const { speaking, speak } = useSpeak();
  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(() => void speak(text, rate, fallback), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, autoPlay]);
  const dim = { sm: "h-9 w-9 text-base", md: "h-14 w-14 text-2xl", lg: "h-24 w-24 text-4xl" }[size];
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void speak(text, rate, fallback);
      }}
      aria-label={label ?? `Nghe: ${text}`}
      className={clsx(
        "btn-candy inline-flex shrink-0 items-center justify-center rounded-full bg-sky-600 text-white",
        dim,
        speaking && "ring-4 ring-sky-100 animate-pulse",
        className,
      )}
    >
      <Icon icon={faVolumeHigh} />
    </button>
  );
}

/** Nút nghe cao hết khối bên cạnh (ô đáp án hoặc thẻ câu hỏi), tách rời bằng khe hở để bé không bấm nhầm. */
export function ListenZone({
  text, fallback, autoPlay = false, label, className,
}: { text: string; fallback?: string; autoPlay?: boolean; label?: string; className?: string }) {
  const { speaking, speak } = useSpeak();
  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(() => void speak(text, undefined, fallback), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, autoPlay]);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void speak(text, undefined, fallback);
      }}
      aria-label={label ?? `Nghe: ${text}`}
      className={clsx(
        "btn-candy flex min-h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-sky-600 text-2xl text-white transition-colors hover:bg-sky-700 sm:w-20",
        speaking && "ring-4 ring-sky-100 animate-pulse",
        className,
      )}
    >
      <Icon icon={faVolumeHigh} />
    </button>
  );
}

/**
 * Thẻ câu hỏi/từ mẫu có nút nghe: nội dung bên trái, nút nghe cao hết thẻ bên phải,
 * cùng nằm trong một khung để bé thấy rõ nút nghe đọc nội dung nào.
 */
export function PromptCard({
  text, fallback, autoPlay = false, label, className, children,
}: { text: string; fallback?: string; autoPlay?: boolean; label?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx("flex max-w-full items-stretch gap-3 rounded-3xl bg-white p-3 pb-4 shadow-[var(--shadow-soft)]", className)}>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-4 px-3">{children}</div>
      <ListenZone text={text} fallback={fallback} autoPlay={autoPlay} label={label} />
    </div>
  );
}
