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
    async speak(text: string, rate?: number) {
      setSpeaking(true);
      await speaker.play(text, { rate });
      setSpeaking(false);
    },
  };
}

export function SpeakButton({
  text, autoPlay = false, size = "md", label, className, rate,
}: { text: string; autoPlay?: boolean; size?: "sm" | "md" | "lg"; label?: string; className?: string; rate?: number }) {
  const { speaking, speak } = useSpeak();
  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(() => void speak(text, rate), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, autoPlay]);
  const dim = { sm: "h-9 w-9 text-base", md: "h-14 w-14 text-2xl", lg: "h-24 w-24 text-4xl" }[size];
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void speak(text, rate);
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
