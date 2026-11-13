"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { clsx } from "clsx";
import type { Response, SaySentence, SayWord } from "@/core/exercises/types";
import { scoreSpeech, type SpeechScore } from "@/core/grading/speech";
import { listener, prepareListener, ListenError, isBlockingError, listenHelp, lastListenErrorRaw, type ListenErrorCode } from "@/subjects/english/speech/listener";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faCheck, faMicrophone } from "@/components/icons";
import { PromptCard } from "./SpeakButton";
import { MicButton } from "./MicButton";

export const MAX_SPEECH_TRIES = 3;

const noopSubscribe = () => () => {};

/** Bé nói từ / câu mẫu. Chấm ngay để tô màu từng từ; tối đa 3 lần rồi cho qua. */
export function SayView({ ex, onAnswer, locked }: { ex: SayWord | SaySentence; onAnswer: (r: Response) => void; locked: boolean }) {
  const canListen = useSyncExternalStore(noopSubscribe, () => listener.isSupported(), () => null);
  const [blocked, setBlocked] = useState<ListenErrorCode | null>(null);
  const supported = blocked ? false : canListen;
  const blockCode: ListenErrorCode = blocked ?? "not-supported";
  const [listening, setListening] = useState(false);
  /** Micro đã thật sự thu chưa (iPad mất ~0,3–1 giây sau khi bấm). */
  const [ready, setReady] = useState(false);
  /** Máy đang nghe thấy bé nói (để hiện sóng âm). */
  const [voice, setVoice] = useState(false);
  const [tries, setTries] = useState(0);
  const [result, setResult] = useState<SpeechScore | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const best = useRef<{ transcript: string; score: number }>({ transcript: "", score: -1 });
  const target = ex.kind === "say-word" ? ex.text : ex.model;
  useEffect(() => prepareListener(), []);

  async function listen() {
    setMessage(null);
    setReady(false);
    setListening(true);
    try {
      const { transcript } = await listener.listen({ expected: ex.accept, onReady: () => setReady(true), onThinking: () => setReady(false), onVoice: setVoice });
      const s = scoreSpeech(transcript, ex.accept);
      setResult(s);
      if (s.score > best.current.score) best.current = { transcript, score: s.score };
      const n = tries + 1;
      setTries(n);
      if (s.passed || n >= MAX_SPEECH_TRIES) onAnswer({ type: "speech", transcript: best.current.transcript });
      else setMessage("Gần đúng rồi! Nghe mẫu rồi nói lại nhé.");
    } catch (e) {
      const code = e instanceof ListenError ? e.code : "other";
      if (isBlockingError(code)) setBlocked(code);
      else {
        setMisses((m) => m + 1);
        setMessage(code === "no-speech" ? "Chưa nghe thấy con nói. Bấm micro rồi nói to hơn nhé." : `Có lỗi khi nghe, thử lại nhé. (mã lỗi: ${e instanceof ListenError ? e.raw ?? code : String(e)})`);
      }
    } finally {
      setListening(false);
      setReady(false);
      setVoice(false);
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
          <p className="max-w-md rounded-2xl bg-sun-100 px-4 py-3 font-bold text-ink" role="alert">{listenHelp(blockCode)}{" "}<span className="font-normal text-muted">(mã lỗi: {blocked ? lastListenErrorRaw() : "no-api"})</span></p>
          <p className="max-w-md text-muted">Tạm thời con nói to theo mẫu rồi bấm nút bên dưới nhé.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {blockCode !== "not-supported" && (
              // Bố mẹ sửa cài đặt xong thì thử nghe lại ngay, không phải tải lại bài
              <Button tone="white" size="lg" disabled={locked} onClick={() => { setBlocked(null); void listen(); }}>
                <Icon icon={faMicrophone} /> Thử lại micro
              </Button>
            )}
            <Button size="lg" disabled={locked} onClick={() => onAnswer({ type: "speech", transcript: "", selfReported: true })}>
              <Icon icon={faCheck} /> Con đã nói
            </Button>
          </div>
        </div>
      ) : (
        <MicButton state={listening ? (ready ? (voice ? "hearing" : "listening") : "opening") : "idle"} disabled={locked || supported === null} onClick={listen} onStop={() => listener.finish()} />
      )}
      <p className="min-h-6 text-center text-lg font-bold text-muted">
        {listening ? (ready ? "Đang nghe… Nói xong bấm micro" : "") : message ?? (tries > 0 ? `Lần ${tries}/${MAX_SPEECH_TRIES}` : "")}
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
