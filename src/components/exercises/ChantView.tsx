"use client";

import { useState } from "react";
import { clsx } from "clsx";
import type { Chant, Response } from "@/core/exercises/types";
import { speaker } from "@/subjects/english/speech/speaker";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faCheck, faMusic, faPlay } from "@/components/icons";

/** Chant kiểu karaoke: máy đọc từng dòng, dòng đang đọc sáng lên. Lượt 2 ẩn từ để bé tự nói. */
export function ChantView({ ex, onAnswer, locked }: { ex: Chant; onAnswer: (r: Response) => void; locked: boolean }) {
  const [current, setCurrent] = useState(-1);
  const [round, setRound] = useState(0);
  const [playing, setPlaying] = useState(false);

  async function play() {
    setPlaying(true);
    for (let i = 0; i < ex.lines.length; i++) {
      setCurrent(i);
      const line = ex.lines[i];
      // Lượt 2: phần `gap` để bé tự nói, máy dừng một nhịp
      const text = round >= 1 && line.gap ? line.text.replace(line.gap, "…") : line.text;
      await speaker.play(text, { rate: 0.9 });
      if (round >= 1 && line.gap) await new Promise((r) => setTimeout(r, 1400));
    }
    setCurrent(-1);
    setPlaying(false);
    setRound((r) => r + 1);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="flex items-center gap-2 text-xl font-bold text-muted">
        <Icon icon={faMusic} /> {ex.title}
      </p>
      <div className="w-full max-w-xl space-y-2 rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        {ex.lines.map((l, i) => {
          const hidden = round >= 1 && l.gap;
          return (
            <p key={i} className={clsx("rounded-xl px-3 py-1 text-2xl font-extrabold transition-colors", current === i ? "bg-sun-300" : "text-ink/80")}>
              {hidden ? (
                <>
                  {l.text.split(l.gap!)[0]}
                  <span className="rounded bg-forest-100 px-2 text-forest-700">{current === i ? l.gap : "____"}</span>
                  {l.text.split(l.gap!)[1]}
                </>
              ) : (
                l.text
              )}
            </p>
          );
        })}
      </div>
      <p className="text-muted">{round === 0 ? "Lượt 1: nghe và hát theo." : "Lượt 2: con tự nói phần còn trống."}</p>
      <div className="flex gap-3">
        <Button size="lg" tone="sky" onClick={play} disabled={playing || locked}>
          <Icon icon={faPlay} /> {round === 0 ? "Bắt đầu" : "Hát lượt nữa"}
        </Button>
        <Button size="lg" onClick={() => onAnswer({ type: "done" })} disabled={round === 0 || playing || locked}>
          <Icon icon={faCheck} /> Xong
        </Button>
      </div>
    </div>
  );
}
