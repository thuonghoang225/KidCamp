"use client";

import Image from "next/image";
import { clsx } from "clsx";
import type { Choice, ImagePickWord, ListenPickImage, PickAnswer, PickSound, Response } from "@/core/exercises/types";
import { SpeakButton } from "./SpeakButton";

type ChoiceExercise = ListenPickImage | ImagePickWord | PickAnswer | PickSound;

export function ChoiceView({
  ex, onAnswer, locked, picked,
}: { ex: ChoiceExercise; onAnswer: (r: Response) => void; locked: boolean; picked: string | null }) {
  const answer = ex.answerId;
  const stateOf = (o: Choice) =>
    !locked || picked === null ? "idle" : o.id === answer ? "right" : o.id === picked ? "wrong" : "dim";

  return (
    <div className="flex flex-col items-center gap-6">
      {ex.kind === "listen-pick-image" && (
        <>
          <p className="text-xl font-bold text-muted">{ex.options.every((o) => o.image) ? "Nghe và chọn hình đúng" : "Nghe và chọn từ đúng"}</p>
          <SpeakButton text={ex.audio} autoPlay size="lg" />
        </>
      )}
      {ex.kind === "image-pick-word" && (
        <>
          <p className="text-xl font-bold text-muted">Đây là gì?</p>
          <Image src={ex.image} alt="" width={200} height={200} className="h-44 w-44 rounded-2xl object-contain" />
        </>
      )}
      {ex.kind === "pick-answer" && (
        <>
          <p className="text-xl font-bold text-muted">Chọn câu trả lời đúng</p>
          <div className="flex items-center gap-4 rounded-3xl bg-white px-6 py-4 shadow-[var(--shadow-soft)]">
            {ex.image && <Image src={ex.image} alt="" width={96} height={96} className="h-24 w-24 rounded-xl object-contain" />}
            <p className="text-2xl font-extrabold">{ex.question}</p>
            <SpeakButton text={ex.question} autoPlay size="sm" />
          </div>
        </>
      )}
      {ex.kind === "pick-sound" && (
        <>
          <p className="text-xl font-bold text-muted">
            Từ nào có âm <span className="text-forest-700">{ex.sound}</span> ({ex.hint})?
          </p>
        </>
      )}

      <div className={clsx("grid w-full max-w-2xl gap-4", ex.kind === "listen-pick-image" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2", ex.kind === "pick-answer" && "sm:grid-cols-1")}>
        {ex.options.map((o) => {
          const st = stateOf(o);
          return (
            <div key={o.id} className="relative">
            <button
              type="button"
              disabled={locked}
              onClick={() => onAnswer({ type: "choice", choiceId: o.id })}
              className={clsx(
                "btn-candy flex min-h-20 w-full items-center justify-center gap-3 rounded-3xl border-4 bg-white p-4 text-xl font-extrabold transition-colors",
                st === "idle" && "border-transparent hover:border-sun-300",
                st === "right" && "border-forest-500 bg-forest-50",
                st === "wrong" && "border-ember-500 bg-ember-100",
                st === "dim" && "border-transparent opacity-50",
              )}
            >
              {ex.kind === "listen-pick-image" && o.image ? (
                <Image src={o.image} alt={locked ? o.label : "lựa chọn"} width={144} height={144} className="h-32 w-32 rounded-2xl object-contain" />
              ) : (
                <span>{o.label}</span>
              )}
            </button>
            {(ex.kind === "pick-sound" || ex.kind === "image-pick-word") && o.audio && (
              <SpeakButton text={o.audio} size="sm" className="absolute right-2 top-2" />
            )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
