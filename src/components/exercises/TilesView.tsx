"use client";

import Image from "next/image";
import { useState } from "react";
import { clsx } from "clsx";
import type { OrderWords, Response, SpellWord } from "@/core/exercises/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faCheck, faRotateRight } from "@/components/icons";
import { SpeakButton } from "./SpeakButton";

/** Xếp chữ cái thành từ (spell-word) hoặc xếp từ thành câu (order-words). */
export function TilesView({ ex, onAnswer, locked }: { ex: SpellWord | OrderWords; onAnswer: (r: Response) => void; locked: boolean }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const isSpell = ex.kind === "spell-word";
  const text = placed.map((i) => ex.tiles[i]).join(isSpell ? "" : " ");

  return (
    <div className="flex flex-col items-center gap-6">
      {isSpell ? (
        <>
          <p className="text-xl font-bold text-muted">Xếp chữ cái thành từ</p>
          <div className="flex items-center gap-4">
            {ex.hint ? (
              <span className="rounded-2xl bg-white px-5 py-3 text-2xl font-extrabold shadow-[var(--shadow-soft)]">{ex.hint}</span>
            ) : (
              <Image src={ex.image} alt="" width={176} height={176} className="h-40 w-40 rounded-2xl object-contain" />
            )}
            <SpeakButton text={ex.audio} autoPlay />
          </div>
        </>
      ) : (
        <>
          <p className="text-xl font-bold text-muted">Xếp các từ thành câu trả lời</p>
          <div className="flex items-center gap-4 rounded-3xl bg-white px-6 py-4 shadow-[var(--shadow-soft)]">
            {ex.image && <Image src={ex.image} alt="" width={96} height={96} className="h-20 w-20 rounded-xl object-contain" />}
            <p className="text-2xl font-extrabold">{ex.question}</p>
            <SpeakButton text={ex.question} autoPlay size="sm" />
          </div>
        </>
      )}

      <div className="flex min-h-20 w-full max-w-2xl flex-wrap items-center justify-center gap-2 rounded-3xl border-4 border-dashed border-forest-200 bg-forest-50 p-3">
        {placed.length === 0 && <span className="text-lg text-muted">Chạm vào ô bên dưới</span>}
        {placed.map((ti, pos) => (
          <button
            key={`${ti}-${pos}`}
            type="button"
            disabled={locked}
            onClick={() => setPlaced((p) => p.filter((_, i) => i !== pos))}
            className="btn-candy rounded-xl bg-sun-300 px-4 py-2 text-2xl font-extrabold"
          >
            {ex.tiles[ti]}
          </button>
        ))}
      </div>

      <div className="flex w-full max-w-2xl flex-wrap justify-center gap-2">
        {ex.tiles.map((t, i) => (
          <button
            key={i}
            type="button"
            disabled={locked || placed.includes(i)}
            onClick={() => setPlaced((p) => [...p, i])}
            className={clsx(
              "btn-candy rounded-xl bg-white px-4 py-2 text-2xl font-extrabold ring-2 ring-forest-100",
              placed.includes(i) && "invisible",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button tone="white" size="lg" onClick={() => setPlaced([])} disabled={locked || placed.length === 0}>
          <Icon icon={faRotateRight} /> Làm lại
        </Button>
        <Button size="lg" onClick={() => onAnswer({ type: "text", text })} disabled={locked || placed.length !== ex.tiles.length}>
          <Icon icon={faCheck} /> Kiểm tra
        </Button>
      </div>
    </div>
  );
}
