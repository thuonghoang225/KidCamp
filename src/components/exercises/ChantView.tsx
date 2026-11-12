"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Chant, Response } from "@/core/exercises/types";
import { startBeat, type Beat } from "@/core/beat";
import { speaker } from "@/subjects/english/speech/speaker";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faCheck, faMusic, faPlay, faStop } from "@/components/icons";

/**
 * Chant theo nhịp (kiểu "jazz chant"): bé đọc theo nhịp trống, không phải hát giai điệu.
 * Lượt 1 – Nghe: máy đọc từng dòng đúng nhịp, chữ sáng dần theo lời.
 * Lượt 2 – Nhắc lại: máy đọc một dòng, bé nhắc lại dòng đó ở ô nhịp kế tiếp.
 * Lượt 3 – Tự chant: chỉ còn nhịp trống, chữ vẫn sáng theo nhịp để bé tự đọc.
 */
type Mode = "listen" | "echo" | "solo";

const MODES: Array<{ id: Mode; label: string; hint: string }> = [
  { id: "listen", label: "Nghe", hint: "Nghe nhịp và đọc thầm theo chữ sáng." },
  { id: "echo", label: "Nhắc lại", hint: "Máy đọc một dòng, con nhắc lại theo nhịp." },
  { id: "solo", label: "Tự chant", hint: "Con tự đọc theo nhịp, chữ sáng dẫn đường." },
];

const BPM = 96;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, Math.max(0, ms)));

/** Mỗi từ được bao nhiêu phần của dòng (theo số chữ cái, tối thiểu 2 để từ ngắn vẫn kịp sáng). */
function wordWeights(line: string): number[] {
  const w = line.split(" ").map((x) => Math.max(x.replace(/[^\p{L}\p{N}]/gu, "").length, 2));
  const total = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  return w.map((x) => {
    const start = acc / total;
    acc += x;
    return start;
  });
}

export function ChantView({ ex, onAnswer, locked }: { ex: Chant; onAnswer: (r: Response) => void; locked: boolean }) {
  const [mode, setMode] = useState<Mode>("listen");
  const [done, setDone] = useState<Set<Mode>>(new Set());
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [kidTurn, setKidTurn] = useState(false);
  const [countIn, setCountIn] = useState(false);
  const beat = useRef<Beat | null>(null);
  const run = useRef(0);

  const stop = () => {
    run.current++;
    beat.current?.stop();
    beat.current = null;
    speaker.stop();
    setPlaying(false);
    setCurrent(-1);
    setKidTurn(false);
    setCountIn(false);
  };
  useEffect(() => stop, []);

  /** Tô chữ không có tiếng (lượt bé đọc): chạy tiến độ theo thời gian. */
  async function sweep(seconds: number, id: number) {
    const t0 = performance.now();
    while (run.current === id) {
      const f = (performance.now() - t0) / 1000 / seconds;
      setProgress(Math.min(f, 1));
      if (f >= 1) return;
      await sleep(40);
    }
  }

  async function play(m: Mode) {
    stop();
    const id = run.current;
    setMode(m);
    setPlaying(true);
    const durations = await Promise.all(ex.lines.map((l) => speaker.duration(l.text)));
    if (run.current !== id) return;
    const b = startBeat(BPM);
    beat.current = b;
    if (!b) {
      // Trình duyệt không có Web Audio: đọc lần lượt như cũ
      for (let i = 0; i < ex.lines.length && run.current === id; i++) {
        setCurrent(i);
        await speaker.play(ex.lines[i].text, { ignoreSlow: true, onProgress: setProgress });
      }
      finish(m, id);
      return;
    }
    setCountIn(true);
    let t = b.nextBar();
    const wait = (at: number) => sleep((at - b.ctx.currentTime) * 1000);

    for (let i = 0; i < ex.lines.length; i++) {
      const line = ex.lines[i].text;
      const dur = durations[i] ?? Math.max(1.6, line.length * 0.07);
      // Mỗi dòng chiếm đủ số ô nhịp để đọc hết lời
      const slot = Math.max(1, Math.ceil((dur + 0.15) / b.bar)) * b.bar;
      await wait(t);
      if (run.current !== id) return;
      setCountIn(false);
      setCurrent(i);
      setProgress(0);
      setKidTurn(m === "solo");
      if (m === "solo") {
        await sweep(dur, id);
      } else {
        b.duck(true);
        await speaker.play(line, { ignoreSlow: true, onProgress: setProgress });
        b.duck(false);
      }
      if (run.current !== id) return;
      t += slot;
      if (b.ctx.currentTime > t) t = b.nextBar();
      if (m === "echo") {
        // Ô nhịp kế tiếp là lượt của bé
        await wait(t);
        if (run.current !== id) return;
        setKidTurn(true);
        setProgress(0);
        await sweep(dur, id);
        t += slot;
      }
    }
    await wait(t);
    finish(m, id);
  }

  function finish(m: Mode, id: number) {
    if (run.current !== id) return;
    stop();
    setDone((d) => new Set(d).add(m));
    const next = MODES[MODES.findIndex((x) => x.id === m) + 1];
    if (next) setMode(next.id);
  }

  const info = MODES.find((x) => x.id === mode)!;

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="flex items-center gap-2 text-xl font-bold text-muted">
        <Icon icon={faMusic} /> {ex.title}
      </p>

      <div role="tablist" aria-label="Lượt chant" className="flex rounded-2xl bg-forest-50 p-1 font-black">
        {MODES.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={mode === x.id}
            disabled={playing}
            onClick={() => setMode(x.id)}
            className={clsx("h-11 rounded-xl px-4", mode === x.id ? "bg-white text-forest-700 shadow" : "text-muted")}
          >
            {i + 1}. {x.label} {done.has(x.id) && <Icon icon={faCheck} className="text-forest-600" />}
          </button>
        ))}
      </div>

      <div className="w-full max-w-xl space-y-2 rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        {ex.lines.map((l, i) => {
          const active = current === i;
          const starts = wordWeights(l.text);
          return (
            <p
              key={i}
              className={clsx(
                "rounded-xl px-3 py-1 text-2xl font-extrabold transition-colors",
                active ? (kidTurn ? "bg-sky-100 ring-2 ring-sky-600" : "bg-sun-100") : "text-ink/70",
              )}
            >
              {l.text.split(" ").map((w, j) => (
                <span key={j} className={clsx("mr-2 transition-colors", active && progress >= starts[j] && (kidTurn ? "text-sky-700" : "text-forest-700"))}>
                  {w}
                </span>
              ))}
            </p>
          );
        })}
      </div>

      <p className="min-h-7 text-lg font-bold text-muted" aria-live="polite">
        {countIn ? "1, 2, 3, 4…" : playing ? (kidTurn ? "Đến lượt con!" : "Nghe nhé…") : info.hint}
      </p>

      <div className="flex gap-3">
        {playing ? (
          <Button size="lg" tone="white" onClick={stop}>
            <Icon icon={faStop} /> Dừng
          </Button>
        ) : (
          <Button size="lg" tone="sky" onClick={() => play(mode)} disabled={locked}>
            <Icon icon={faPlay} /> {done.has(mode) ? "Chant lại" : "Bắt đầu"}
          </Button>
        )}
        <Button size="lg" onClick={() => { stop(); onAnswer({ type: "done" }); }} disabled={done.size === 0 || playing || locked}>
          <Icon icon={faCheck} /> Xong
        </Button>
      </div>
    </div>
  );
}
