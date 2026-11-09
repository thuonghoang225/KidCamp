"use client";

import Image from "next/image";
import { clsx } from "clsx";
import type { Choice, ImagePickWord, ListenPickImage, PickAnswer, PickSound, Response } from "@/core/exercises/types";
import { soundText } from "@/subjects/english/speech/sounds";
import { ListenZone, PromptCard, SpeakButton } from "./SpeakButton";

type ChoiceExercise = ListenPickImage | ImagePickWord | PickAnswer | PickSound;

export function ChoiceView({
  ex, onAnswer, locked, picked,
}: { ex: ChoiceExercise; onAnswer: (r: Response) => void; locked: boolean; picked: string | null }) {
  const answer = ex.answerId;
  const stateOf = (o: Choice) =>
    !locked || picked === null ? "idle" : o.id === answer ? "right" : o.id === picked ? "wrong" : "dim";

  const withAudio = (ex.kind === "pick-sound" || ex.kind === "image-pick-word") && ex.options.some((o) => o.audio);

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
          <PromptCard text={ex.question} autoPlay>
            {ex.image && <Image src={ex.image} alt="" width={96} height={96} className="h-24 w-24 rounded-xl object-contain" />}
            <p className="text-2xl font-extrabold">{ex.question}</p>
          </PromptCard>
        </>
      )}
      {ex.kind === "pick-sound" && (
        <>
          {/* Câu hỏi trên một dòng; nút loa nhỏ ngay sau âm và sau từ mẫu (nằm trong dòng chữ nên không lẫn với đáp án) */}
          <p className="text-center text-xl font-bold leading-loose text-muted">
            Từ nào có âm <span className="text-2xl font-black text-forest-700">{ex.sound}</span>
            <SpeakButton text={soundText(ex.sound)} fallback={ex.example} autoPlay size="sm" label={`Nghe âm ${ex.sound}`} className="mx-1.5 align-middle" />
            ({ex.hint.replace(/\s*\S+$/, "")} <span className="font-extrabold text-ink">{ex.example}</span>
            <SpeakButton text={ex.example} size="sm" label={`Nghe từ mẫu ${ex.example}`} className="ml-1.5 align-middle" />)?
          </p>
        </>
      )}

      <div className={clsx("grid w-full max-w-2xl", withAudio ? "gap-x-6 gap-y-4" : "gap-4", ex.kind === "listen-pick-image" ? "grid-cols-2 sm:grid-cols-4" : ex.kind === "pick-answer" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
        {ex.options.map((o) => {
          const st = stateOf(o);
          return (
            // Nút đáp án và nút nghe là 2 nút kẹo tách rời, mỗi nút tự lún; khay nền chung gom 2 nút thành 1 cặp
            // để bé biết nút nghe thuộc ô nào (nhất là khi xếp 2 cột).
            <div key={o.id} className={clsx("flex items-stretch gap-2", withAudio && "rounded-[2rem] bg-sky-100 p-2 pb-3")}>
              <button
                type="button"
                disabled={locked}
                onClick={() => onAnswer({ type: "choice", choiceId: o.id })}
                className={clsx(
                  "btn-candy flex min-h-20 flex-1 items-center justify-center gap-3 rounded-3xl border-4 bg-white p-4 text-xl font-extrabold transition-colors",
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
              {withAudio && o.audio && (
                <ListenZone text={o.audio} label={`Nghe: ${o.label}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
