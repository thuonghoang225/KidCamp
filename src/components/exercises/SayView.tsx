"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { clsx } from "clsx";
import type { Response, SaySentence, SayWord } from "@/core/exercises/types";
import { scoreSpeech, type SpeechScore } from "@/core/grading/speech";
import { listener, ListenError } from "@/subjects/english/speech/listener";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faCheck, faMicrophone } from "@/components/icons";
import { PromptCard } from "./SpeakButton";

export const MAX_SPEECH_TRIES = 3;

const noopSubscribe = () => () => {};

/** Bé nói từ / câu mẫu. Chấm ngay để tô màu từng từ; tối đa 3 lần rồi cho qua. */
export function SayView({ ex, onAnswer, locked }: { ex: SayWord | SaySentence; onAnswer: (r: Response) => void; locked: boolean }) {
  const canListen = useSyncExternalStore(noopSubscribe, () => listener.isSupported(), () => null);
  const [blocked, setBlocked] = useState(false);
  const supported = blocked ? false : canListen;
  const [listening, setListening] = useState(false);
  const [tries, setTries] = useState(0);
  const [result, setResult] = useState<SpeechScore | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const best = useRef<{ transcript: string; score: number }>({ transcript: "", score: -1 });
  const target = ex.kind === "say-word" ? ex.text : ex.model;

  async function listen() {
    setMessage(null);
    setListening(true);
    try {
      const { transcript } = await listener.listen({ expected: ex.accept });
      const s = scoreSpeech(transcript, ex.accept);
      setResult(s);
      if (s.score > best.current.score) best.current = { transcript, score: s.score };
      const n = tries + 1;
      setTries(n);
      if (s.passed || n >= MAX_SPEECH_TRIES) onAnswer({ type: "speech", transcript: best.current.transcript });
      else setMessage("Gần đúng rồi! Nghe mẫu rồi nói lại nhé.");
    } catch (e) {
      const code = e instanceof ListenError ? e.code : "other";
      if (code === "not-allowed" || code === "not-supported") setBlocked(true);
      else {
        setMisses((m) => m + 1);
        setMessage(code === "no-speech" ? "Chưa nghe thấy con nói. Bấm micro rồi nói to hơn nhé." : "Có lỗi khi nghe, thử lại nhé.");
      }
    } finally {
      setListening(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xl font-bold text-muted">{ex.kind === "say-word" ? "Nghe rồi nói theo" : "Trả lời bằng giọng nói"}</p>

      {ex.kind === "say-sentence" && (
        <PromptCard text={ex.question} autoPlay>
          {ex.image && <Image src={ex.image} alt="" width={96} height={96} className="h-20 w-20 rounded-xl object-contain" />}
          <p className="text-2xl font-extrabold">{ex.question}</p>
        </PromptCard>
      )}
      {ex.kind === "say-word" && ex.image && <Image src={ex.image} alt="" width={176} height={176} className="h-40 w-40 rounded-2xl object-contain" />}

      <PromptCard text={target} autoPlay={ex.kind === "say-word"}>
        <p className="py-2 text-3xl font-black text-forest-700">
          {result
            ? result.words.map((w, i) => (
                <span key={i} className={clsx("mr-2", w.matched ? "text-forest-600" : "text-ember-600 underline decoration-wavy")}>
                  {w.word}
                </span>
              ))
            : target}
        </p>
      </PromptCard>
      {ex.kind === "say-word" && ex.meaning && <p className="text-lg text-muted">{ex.meaning}</p>}

      {supported === false ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="max-w-md text-muted">Thiết bị này chưa nghe được giọng nói. Con nói to theo mẫu rồi bấm nút bên dưới nhé.</p>
          <Button size="lg" disabled={locked} onClick={() => onAnswer({ type: "speech", transcript: "", selfReported: true })}>
            <Icon icon={faCheck} /> Con đã nói
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={locked || listening || supported === null}
          onClick={listen}
          aria-label="Bấm để nói"
          className={clsx(
            "btn-candy flex h-28 w-28 items-center justify-center rounded-full text-5xl text-white",
            listening ? "bg-ember-500 animate-pulse ring-8 ring-ember-100" : "bg-forest-500",
          )}
        >
          <Icon icon={faMicrophone} />
        </button>
      )}
      <p className="min-h-6 text-center text-lg font-bold text-muted">
        {listening ? "Đang nghe…" : message ?? (tries > 0 ? `Lần ${tries}/${MAX_SPEECH_TRIES}` : "")}
      </p>
      {supported && (misses >= 2 || tries >= 1) && !locked && !listening && (
        // Micro không nghe được (phòng ồn, máy lỗi): không để bé bị kẹt
        <Button tone="ghost" onClick={() => onAnswer({ type: "speech", transcript: best.current.transcript })}>
          Bỏ qua câu này
        </Button>
      )}
    </div>
  );
}
